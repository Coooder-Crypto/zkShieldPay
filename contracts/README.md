# 「多币种匿名池架构」 zkShieldPay
🧱 核心设计选择：
- 每种代币都有一个独立的匿名池（一个 shielded_pool 实例，内部记录 coin_type）

- 所有池统一使用相同的逻辑和 zk 电路

- 后端根据币种自动切换池地址 + proof 参数

| 模块名                         | 职责                          | 支持币种     | 备注                                    |
| --------------------------- | --------------------------- | -------- | ------------------------------------- |
| `shielded_pool`          | 对应某种币种的匿名池                  | 内部记录 coin_type | 如 AptosCoin、0xabc::usdc::USDC |
| `shielded_registry`         | 用户 viewing key 注册 + 解密 note | 所有币种共用   |                                       |
| `verifier_groth16`          | zkSNARK 验证                  | 所有币种共用   | 一套 verifying key 可通用于多币种              |
| `shielded_asset_router | 管理币种与对应 pool                | 所有币种     | 路由功能（coinType => pool address）        |

# 🏗 各模块职责与边界

## 📦 shielded_pool.move（核心）
管理匿名交易池：commitments / nullifiers / shield / transfer / unshield 流程。

主要结构：
```move
struct Commitment { hash: vector<u8>, amount_cipher: vector<u8>, note_data: vector<u8> }

struct MerkleTree {
    root: vector<u8>,
    frontier: vector<vector<u8>>, // optional: 支持增量更新
}

struct NullifierSet {
    used: table::Table<vector<u8>, bool>,
}

resource struct PoolState {
    merkle_tree: MerkleTree,
    nullifiers: NullifierSet,
    commitments: vector<Commitment>, // for dev/test，prod使用event或只更新Merkle
}
```
主要函数：

init(account)：初始化池子、Merkle树、事件句柄

shield()：用户将 coin 转入池子，生成 commitment + emit_event

private_transfer(proof, new_commitments, nullifiers)：验证 zk 证明、标记 nullifier、更新 commitment（匿名转账）

unshield(proof, recipient, nullifiers)：验证 zk 证明，将 coin 转回公开账户

## 🔐 verifier_groth16.move

存放 VerifyingKey，并暴露验证入口（Groth16）。

结构：
```move
struct VerifyingKey has key {
    alpha_g1: vector<u8>,
    beta_g2: vector<u8>,
    gamma_g2: vector<u8>,
    delta_g2: vector<u8>,
    ic: vector<vector<u8>>,
}
```
函数：

register_vk(caller, key_bytes)：注册 verifying key

verify(proof_bytes, public_inputs): bool

可以为：

transfer-proof

unshield-proof

分别注册两个 verifying key。

APT 官方 zk 模块已有支持，可直接用 zk::groth16【支持 BLS12-381】。

## 🧾 shielded_registry.move（接收通知 + viewing key 注册）
允许每个用户注册 viewing key（或 pk_view），供收款方识别 commitment 属于自己。

结构：
```move
struct UserViewKey has key {
    pk_view: vector<u8>,
    encrypted_notes: vector<vector<u8>>, // optional, viewing key 解密通知
}
```

函数：

register_view_key(pk_view)

receive_note(commitment_hash, encrypted_memo)

get_notes()（给前端查看）

此模块与前端钱包配合，让用户轻松发现“我收到的隐私转账”。

## 🪙 shielded_assets.move（可选）
管理多种代币（APT/USDC等）隔离匿名池。

结构：
```move
struct AssetPoolInfo has key {
    coin_type: string,
    pool_address: address, // 该币种对应的匿名池地址
}
```

功能：

register_asset(coin_type, pool_address)

get_pool(coin_type)

# 📊 模块依赖图
```
                     ┌────────────────────┐
                     │  shielded_registry │◄────┐
                     └────────────────────┘     │
                             ▲                  │
                             │ viewing_key      │
                             │                  ▼
┌────────────┐     ┌────────────────────┐     ┌────────────────────┐
│ AptosCoin  │────►│   shielded_pool    │────►│  verifier_groth16  │
└────────────┘     └────────────────────┘     └────────────────────┘
                             ▲
                             │
                             ▼
                     ┌────────────────────┐
                     │ shielded_assets(*) │
                     └────────────────────┘
```
