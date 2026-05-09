#[test_only]
module riot_nft::riot_nft_tests {
    use riot_nft::riot_nft::{Self, AgentRegistry, AdminCap};
    use sui::test_scenario;
    use std::string;

    #[test]
    fun test_mint_agent() {
        let addr1 = @0xA;
        let scenario = test_scenario::begin(addr1);

        // Init
        {
            riot_nft::test_init(test_scenario::ctx(&mut scenario));
        };

        // Mint agent
        test_scenario::next_tx(&mut scenario, addr1);
        {
            let registry = test_scenario::take_shared<AgentRegistry>(&scenario);
            riot_nft::mint_agent(
                &mut registry,
                string::utf8(b"J4"),
                string::utf8(b"J4 The Veteran"),
                string::utf8(b"frontman"),
                string::utf8(b"cynical, battle-hardened"),
                string::utf8(b"memwal_j4_001"),
                string::utf8(b"0xabc123"),
                test_scenario::ctx(&mut scenario)
            );
            assert!(riot_nft::get_registry_count(&registry) == 1, 0);
            test_scenario::return_shared(registry);
        };

        test_scenario::end(scenario);
    }
}
