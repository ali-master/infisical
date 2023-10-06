import { useEffect } from "react";
import { useRouter } from "next/router";
import queryString from "query-string";

import { read } from "@app/helpers/storage";
import { useAuthorizeIntegration } from "@app/hooks/api";

export default function GCPSecretManagerOAuth2CallbackPage() {
  const router = useRouter();
  const { mutateAsync } = useAuthorizeIntegration();

  const { code, state } = queryString.parse(router.asPath.split("?")[1]);

  useEffect(() => {
    (async () => {
      try {
        // validate state
        if (state !== read<string>("latestCSRFToken")) return;
        localStorage.removeItem("latestCSRFToken");
        const integrationAuth = await mutateAsync({
          workspaceId: read<string>("projectData.id")!,
          code: code as string,
          integration: "gcp-secret-manager"
        });

        await router.push(
          `/integrations/gcp-secret-manager/create?integrationAuthId=${integrationAuth._id}`
        );
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return <div />;
}

GCPSecretManagerOAuth2CallbackPage.requireAuth = true;
