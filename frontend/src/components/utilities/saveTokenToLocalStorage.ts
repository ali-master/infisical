import { remove, write } from "@app/helpers/storage";

type Props = {
  protectedKey?: string;
  protectedKeyIV?: string;
  protectedKeyTag?: string;
  publicKey?: string;
  encryptedPrivateKey?: string;
  iv?: string;
  tag?: string;
  privateKey?: string;
};

export const saveTokenToLocalStorage = ({
  protectedKey,
  protectedKeyIV,
  protectedKeyTag,
  publicKey,
  encryptedPrivateKey,
  iv,
  tag,
  privateKey
}: Props) => {
  try {
    if (protectedKey) {
      remove("protectedKey");
      write("protectedKey", protectedKey);
    }

    if (protectedKeyIV) {
      remove("protectedKeyIV");
      write("protectedKeyIV", protectedKeyIV);
    }

    if (protectedKeyTag) {
      remove("protectedKeyTag");
      write("protectedKeyTag", protectedKeyTag);
    }

    if (publicKey) {
      remove("publicKey");
      write("publicKey", publicKey);
    }

    if (encryptedPrivateKey) {
      remove("encryptedPrivateKey");
      write("encryptedPrivateKey", encryptedPrivateKey);
    }

    if (iv) {
      remove("iv");
      write("iv", iv);
    }

    if (tag) {
      remove("tag");
      write("tag", tag);
    }

    if (privateKey) {
      remove("PRIVATE_KEY");
      write("PRIVATE_KEY", privateKey);
    }
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Unable to send the tokens in local storage:${err.message}`);
    }
  }
};
