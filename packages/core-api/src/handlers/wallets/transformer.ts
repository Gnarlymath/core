import { State } from "@arkecosystem/core-interfaces";
import { Interfaces, Utils } from "@arkecosystem/crypto";

export const transformWallet = (wallet: State.IWallet) => {
    const username: string = wallet.getAttribute("delegate.username");
    const multiSignature: Interfaces.IMultiSignatureAsset = wallet.getAttribute("multiSignature");
    const locks: Interfaces.IHtlcLocks = wallet.getAttribute("htlc.locks");

    return {
        address: wallet.address,
        publicKey: wallet.publicKey,
        username,
        nonce: wallet.nonce.toFixed(),
        secondPublicKey: wallet.getAttribute("secondPublicKey"),
        balance: Utils.BigNumber.make(wallet.balance).toFixed(),
        isDelegate: !!username,
        isResigned: !!wallet.getAttribute("delegate.resigned"),
        vote: wallet.getAttribute("vote"),
        multiSignature,
        locks,
        debug: (wallet as any).attributes,
    };
};
