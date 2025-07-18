module zkShieldPay::verifier_groth16 {
    // use zk::groth16;
    public fun verify(
        proof: vector<u8>,
        public_inputs: vector<vector<u8>>,
    ): bool {
        // TODO: 实现实际的zk证明验证
        // groth16::verify_proof_hardcoded(proof, public_inputs)

        // 暂时返回true方便测试
        true
    }
}
