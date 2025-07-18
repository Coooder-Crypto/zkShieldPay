module zkShieldPay::shielded_registry {

    struct Registry has key {
        pk_view: vector<u8>,
    }

    public entry fun register_view_key(account: &signer, pk_view: vector<u8>) {
        move_to(account, Registry { pk_view });
    }

    public fun get_view_key(addr: address): vector<u8> acquires Registry {
        borrow_global<Registry>(addr).pk_view
    }
}
