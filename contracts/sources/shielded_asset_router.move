module zkShieldPay::shielded_asset_router {
    use std::table;
    use std::signer;
    use aptos_framework::type_info::{TypeInfo, type_of};

    struct Router has key {
        routes: table::Table<TypeInfo, address>,
    }

    public entry fun init(admin: &signer) {
        move_to(admin, Router { routes: table::new<TypeInfo, address>() });
    }

    public entry fun register<T>(admin: &signer, pool_addr: address) acquires Router {
        let r = borrow_global_mut<Router>(signer::address_of(admin));
        table::add(&mut r.routes, type_of<T>(), pool_addr);
    }

    public fun get_pool<T>(): address acquires Router {
        let r = borrow_global<Router>(@zkShieldPay);
        *table::borrow(&r.routes, type_of<T>())
    }
}
