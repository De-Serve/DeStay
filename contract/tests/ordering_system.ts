import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { OrderingSystem } from "../target/types/ordering_system";

describe("ordering_system", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.OrderingSystem as Program<OrderingSystem>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
