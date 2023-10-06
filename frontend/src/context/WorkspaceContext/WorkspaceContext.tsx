// Utilities
// Types
import type { ReactNode } from "react";
import { createContext , useContext, useMemo } from "react";
// Hooks
import { useRouter } from "next/router";

import { read } from "@app/helpers/storage";
import { useGetUserWorkspaces } from "@app/hooks/api";
import type { Workspace } from "@app/hooks/api/workspace/types";

type TWorkspaceContext = {
  workspaces: Workspace[];
  currentWorkspace?: Workspace;
  isLoading: boolean;
};

const WorkspaceContext = createContext<TWorkspaceContext | null>(null);

type Props = {
  children: ReactNode;
};

export const WorkspaceProvider = ({ children }: Props): JSX.Element => {
  const { data: ws, isLoading } = useGetUserWorkspaces();
  const router = useRouter();
  const workspaceId = router.query.id;

  // memorize the workspace details for the context
  const value = useMemo<TWorkspaceContext>(() => {
    const workspaces = ws || [];
    const wsId = workspaceId || read("projectData.id");
    const currentWorkspace = workspaces.find(({ _id: id }) => id === wsId);

    return {
      workspaces,
      currentWorkspace,
      isLoading
    };
  }, [ws, workspaceId, isLoading]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace has to be used within <WorkspaceContext.Provider>");
  }

  return ctx;
};
