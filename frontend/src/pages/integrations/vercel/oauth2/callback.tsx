import { useEffect } from "react";
import { useRouter } from "next/router";
import queryString from "query-string";

import { read, remove } from "@app/helpers/storage";
import { useAuthorizeIntegration } from "@app/hooks/api";

export default function VercelOAuth2CallbackPage() {
  const router = useRouter();
  const { mutateAsync } = useAuthorizeIntegration();

  const { code, state } = queryString.parse(router.asPath.split("?")[1]);

  useEffect(() => {
    (async () => {
      try {
        // validate state
        if (state !== read<string>("latestCSRFToken")) return;
        remove("latestCSRFToken");

        const integrationAuth = await mutateAsync({
          workspaceId: read<string>("projectData.id")!,
          code: code as string,
          integration: "vercel"
        });

        await router.push(`/integrations/vercel/create?integrationAuthId=${integrationAuth._id}`);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return <div />;
}

VercelOAuth2CallbackPage.requireAuth = true;
