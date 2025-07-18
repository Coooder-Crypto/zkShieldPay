module zkShieldPay::shielded_pool {
    use std::signer;
    use std::vector;
    use std::table;
    use std::event::{EventHandle, emit_event};
    use aptos_framework::coin::{Self};
    use aptos_framework::type_info::{TypeInfo, type_of};
    use aptos_framework::account;

    struct Commitment has copy, drop, store {
        hash: vector<u8>,
        amount_cipher: vector<u8>,
        note_data: vector<u8>,
    }

    struct MerkleRoot has key {
        root: vector<u8>,
        coin_type: TypeInfo,
    }

    struct NullifierStore has key {
        used: table::Table<vector<u8>, bool>,
    }

    struct Events has key {
        shield_handle: EventHandle<Commitment>,
    }

    public entry fun init_pool<T>(admin: &signer) {
        let addr = signer::address_of(admin);
        assert!(!exists<MerkleRoot>(addr), 1);
        move_to(admin, MerkleRoot { 
            root: vector::empty<u8>(),
            coin_type: type_of<T>(),
        });
        move_to(admin, NullifierStore { used: table::new<vector<u8>, bool>() });
        move_to(admin, Events {
            shield_handle: account::new_event_handle<Commitment>(admin),
        });
    }

    public entry fun shield<T>(
        sender: &signer,
        amount: u64,
        commitment_hash: vector<u8>,
        amount_cipher: vector<u8>,
        note_data: vector<u8>,
    ) acquires Events {
        let pool_addr = signer::address_of(sender);
        coin::transfer<T>(sender, pool_addr, amount);

        emit_event(
            &mut borrow_global_mut<Events>(pool_addr).shield_handle,
            Commitment {
                hash: commitment_hash,
                amount_cipher,
                note_data,
            },
        );
    }

    public entry fun private_transfer(
        sender: &signer,
        zk_proof: vector<u8>,
        public_inputs: vector<vector<u8>>,
        nullifiers: vector<vector<u8>>,
        new_commitment_hashes: vector<vector<u8>>,
        new_amount_ciphers: vector<vector<u8>>,
        new_note_datas: vector<vector<u8>>,
    ) acquires NullifierStore, Events {
        let is_valid = zkShieldPay::verifier_groth16::verify(zk_proof, public_inputs);
        assert!(is_valid, 101);

        let ns = borrow_global_mut<NullifierStore>(signer::address_of(sender));
        let table_ref = &mut ns.used;
        let i = 0;
        while (i < vector::length(&nullifiers)) {
            let n = *vector::borrow(&nullifiers, i);
            assert!(!table::contains(table_ref, n), 102);
            table::add(table_ref, n, true);
            i = i + 1
        };

        let events = borrow_global_mut<Events>(signer::address_of(sender));
        let ev = &mut events.shield_handle;
        let j = 0;
        while (j < vector::length(&new_commitment_hashes)) {
            let commitment = Commitment {
                hash: *vector::borrow(&new_commitment_hashes, j),
                amount_cipher: *vector::borrow(&new_amount_ciphers, j),
                note_data: *vector::borrow(&new_note_datas, j),
            };
            emit_event(ev, commitment);
            j = j + 1
        };
    }

    public entry fun unshield<T>(
        sender: &signer,
        proof: vector<u8>,
        public_inputs: vector<vector<u8>>,
        nullifiers: vector<vector<u8>>,
        amount: u64,
        recipient: address,
    ) acquires NullifierStore {
        let ok = zkShieldPay::verifier_groth16::verify(proof, public_inputs);
        assert!(ok, 201);

        let ns = borrow_global_mut<NullifierStore>(signer::address_of(sender));
        let table_ref = &mut ns.used;
        let i = 0;
        while (i < vector::length(&nullifiers)) {
            let n = *vector::borrow(&nullifiers, i);
            assert!(!table::contains(table_ref, n), 202);
            table::add(table_ref, n, true);
            i = i + 1
        };

        // 注意：在Move中，从pool账户提取需要pool账户的签名
        // 这里简化处理，实际应用需要更复杂的权限管理
        coin::transfer<T>(sender, recipient, amount);
    }

    public fun get_pool_coin_type(pool_addr: address): TypeInfo acquires MerkleRoot {
        borrow_global<MerkleRoot>(pool_addr).coin_type
    }
}