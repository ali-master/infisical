import crypto from "crypto";

import { read, write } from "@app/helpers/storage";
import { TCloudIntegration, UserWsKeyPair } from "@app/hooks/api/types";

import {
  decryptAssymmetric,
  encryptAssymmetric
} from "../../components/utilities/cryptography/crypto";

export const generateBotKey = (botPublicKey: string, latestKey: UserWsKeyPair) => {
  const PRIVATE_KEY = read<string>("PRIVATE_KEY")!;

  if (!PRIVATE_KEY) {
    throw new Error("Private Key missing");
  }

  const WORKSPACE_KEY = decryptAssymmetric({
    ciphertext: latestKey.encryptedKey,
    nonce: latestKey.nonce,
    publicKey: latestKey.sender.publicKey,
    privateKey: PRIVATE_KEY
  });

  const { ciphertext, nonce } = encryptAssymmetric({
    plaintext: WORKSPACE_KEY,
    publicKey: botPublicKey,
    privateKey: PRIVATE_KEY
  });

  return { encryptedKey: ciphertext, nonce };
};

export const redirectForProviderAuth = (integrationOption: TCloudIntegration) => {
  try {
    // generate CSRF token for OAuth2 code-token exchange integrations
    const state = crypto.randomBytes(16).toString("hex");
    write("latestCSRFToken", state);

    const locationOrigin = window.location.origin;
    const { clientId, clientSlug, slug } = integrationOption;

    let link = "";
    switch (slug) {
      case "gcp-secret-manager":
        link = `${locationOrigin}/integrations/gcp-secret-manager/authorize`;
        break;
      case "azure-key-vault":
        link = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${locationOrigin}/integrations/azure-key-vault/oauth2/callback&response_mode=query&scope=https://vault.azure.net/.default openid offline_access&state=${state}`;
        break;
      case "aws-parameter-store":
        link = `${locationOrigin}/integrations/aws-parameter-store/authorize`;
        break;
      case "aws-secret-manager":
        link = `${locationOrigin}/integrations/aws-secret-manager/authorize`;
        break;
      case "heroku":
        link = `https://id.heroku.com/oauth/authorize?client_id=${clientId}&response_type=code&scope=write-protected&state=${state}`;
        break;
      case "vercel":
        link = `https://vercel.com/integrations/${clientSlug}/new?state=${state}`;
        break;
      case "netlify":
        link = `https://app.netlify.com/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${locationOrigin}/integrations/netlify/oauth2/callback`;
        break;
      case "github":
        link = `https://github.com/login/oauth/authorize?client_id=${clientId}&response_type=code&scope=repo&redirect_uri=${locationOrigin}/integrations/github/oauth2/callback&state=${state}`;
        break;
      case "gitlab":
        link = `${locationOrigin}/integrations/gitlab/authorize`;
        break;
      case "render":
        link = `${locationOrigin}/integrations/render/authorize`;
        break;
      case "flyio":
        link = `${locationOrigin}/integrations/flyio/authorize`;
        break;
      case "circleci":
        link = `${locationOrigin}/integrations/circleci/authorize`;
        break;
      case "laravel-forge":
        link = `${locationOrigin}/integrations/laravel-forge/authorize`;
        break;
      case "travisci":
        link = `${locationOrigin}/integrations/travisci/authorize`;
        break;
      case "supabase":
        link = `${locationOrigin}/integrations/supabase/authorize`;
        break;
      case "checkly":
        link = `${locationOrigin}/integrations/checkly/authorize`;
        break;
      case "qovery":
        link = `${locationOrigin}/integrations/qovery/authorize`;
        break;
      case "railway":
        link = `${locationOrigin}/integrations/railway/authorize`;
        break;
      case "terraform-cloud":
        link = `${locationOrigin}/integrations/terraform-cloud/authorize`;
        break;
      case "hashicorp-vault":
        link = `${locationOrigin}/integrations/hashicorp-vault/authorize`;
        break;
      case "cloudflare-pages":
        link = `${locationOrigin}/integrations/cloudflare-pages/authorize`;
        break;
      case "bitbucket":
        link = `https://bitbucket.org/site/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${locationOrigin}/integrations/bitbucket/oauth2/callback&state=${state}`;
        break;
      case "codefresh":
        link = `${locationOrigin}/integrations/codefresh/authorize`;
        break;
      case "digital-ocean-app-platform":
        link = `${locationOrigin}/integrations/digital-ocean-app-platform/authorize`;
        break;
      case "cloud-66":
        link = `${locationOrigin}/integrations/cloud-66/authorize`;
        break;
      case "northflank":
        link = `${locationOrigin}/integrations/northflank/authorize`;
        break;
      case "windmill":
        link = `${locationOrigin}/integrations/windmill/authorize`;
        break;
      case "teamcity":
        link = `${locationOrigin}/integrations/teamcity/authorize`;
        break;
      default:
        break;
    }

    if (link !== "") {
      window.location.assign(link);
    }
  } catch (err) {
    console.error(err);
  }
};

export const redirectToIntegrationAppConfigScreen = (provider: string, integrationAuthId: string) =>
  `/integrations/${provider}/create?integrationAuthId=${integrationAuthId}`;
