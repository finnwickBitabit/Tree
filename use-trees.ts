import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTree, type Tree } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTrees() {
  return useQuery({
    queryKey: [api.trees.list.path],
    queryFn: async () => {
      const res = await fetch(api.trees.list.path);
      if (!res.ok) throw new Error("Failed to fetch trees");
      return api.trees.list.responses[200].parse(await res.json());
    },
  });
}

export function useTree(id: number) {
  return useQuery({
    queryKey: [api.trees.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.trees.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch tree");
      return api.trees.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateTree() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertTree) => {
      // API expects strings/numbers as JSON.
      // Schema validation happens on backend, but frontend form ensures correct types.
      const res = await fetch(api.trees.create.path, {
        method: api.trees.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.trees.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to plant tree");
      }
      return api.trees.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.trees.list.path] });
      toast({
        title: "Tree Planted 🌱",
        description: "Your new tree has been successfully added to the collection.",
      });
    },
    onError: (error) => {
      toast({
        title: "Planting Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTree() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.trees.delete.path, { id });
      const res = await fetch(url, {
        method: api.trees.delete.method,
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Tree not found");
        throw new Error("Failed to remove tree");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.trees.list.path] });
      toast({
        title: "Tree Removed",
        description: "The tree has been removed from your collection.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
