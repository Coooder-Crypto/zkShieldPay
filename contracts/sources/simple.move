module zk_simple::zk_pay {
    use std::signer;
    use aptos_std::table::{Table, Self as TableModule};
    use aptos_framework::coin::{Coin, Self as CoinModule};
    use aptos_framework::aptos_coin::AptosCoin;

    const E_REGISTRY_NOT_INIT: u64 = 0;
    const E_VAULT_NOT_FOUND: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;

    struct Vault<phantom CoinType> has store {
        balance: Coin<CoinType>,
    }

    struct Registry<phantom CoinType> has key {
        vaults: Table<vector<u8>, Vault<CoinType>>,
    }

    fun reg_addr(): address { @zk_simple }

    public entry fun init_registry<CoinType>(admin: &signer) {
        assert!(signer::address_of(admin) == reg_addr(), E_REGISTRY_NOT_INIT);
        assert!(!exists<Registry<CoinType>>(reg_addr()), E_REGISTRY_NOT_INIT);

        move_to(admin, Registry<CoinType>{
            vaults: TableModule::new<vector<u8>, Vault<CoinType>>()
        });
    }

    public entry fun shield<CoinType>(caller: &signer, id: vector<u8>, amount: u64) acquires Registry {
        let coins = CoinModule::withdraw<CoinType>(caller, amount);
        let reg = borrow_global_mut<Registry<CoinType>>(reg_addr());

        if (TableModule::contains(&reg.vaults, id)) {
            let v = TableModule::borrow_mut(&mut reg.vaults, id);
            CoinModule::merge(&mut v.balance, coins);
        } else {
            TableModule::add(&mut reg.vaults, id, Vault<CoinType>{ balance: coins });
        };
    }

    public entry fun transfer_zk<CoinType>(
        _caller: &signer,
        from_id: vector<u8>,
        to_id: vector<u8>,
        amount: u64
    ) acquires Registry {
        let reg = borrow_global_mut<Registry<CoinType>>(reg_addr());

        let from_v = TableModule::borrow_mut(&mut reg.vaults, from_id);
        let coins = CoinModule::extract(&mut from_v.balance, amount);

        if (TableModule::contains(&reg.vaults, to_id)) {
            let to_v = TableModule::borrow_mut(&mut reg.vaults, to_id);
            CoinModule::merge(&mut to_v.balance, coins);
        } else {
            TableModule::add(&mut reg.vaults, to_id, Vault<CoinType>{ balance: coins });
        };
    }

    public entry fun unshield<CoinType>(caller: &signer, id: vector<u8>, amount: u64) acquires Registry {
        let reg = borrow_global_mut<Registry<CoinType>>(reg_addr());
        let v = TableModule::borrow_mut(&mut reg.vaults, id);
        let coins = CoinModule::extract(&mut v.balance, amount);
        CoinModule::deposit<CoinType>(signer::address_of(caller), coins);
    }

    public entry fun init_registry_apt(admin: &signer) {
        init_registry<AptosCoin>(admin);
    }

    public entry fun shield_apt(caller: &signer, id: vector<u8>, amount: u64) acquires Registry {
        shield<AptosCoin>(caller, id, amount);
    }

    public entry fun transfer_zk_apt(caller: &signer, from_id: vector<u8>, to_id: vector<u8>, amount: u64) acquires Registry {
        transfer_zk<AptosCoin>(caller, from_id, to_id, amount);
    }

    public entry fun unshield_apt(caller: &signer, id: vector<u8>, amount: u64) acquires Registry {
        unshield<AptosCoin>(caller, id, amount);
    }
}