import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { ApiError } from "@/lib/client";

interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: Error) => string);
  disableErrorToast?: boolean;
}

export function useMutation<TData = any, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TVariables>
) {
  const [isMutating, setIsMutating] = useState(false);
  const toast = useToast();

  const mutate = async (variables: TVariables) => {
    setIsMutating(true);
    try {
      const data = await mutationFn(variables);
      if (options?.successMessage) {
        toast(
          "success",
          typeof options.successMessage === "string"
            ? options.successMessage
            : options.successMessage(data)
        );
      }
      options?.onSuccess?.(data, variables);
      return data;
    } catch (err) {
      const error = err as Error;
      let msg = "Terjadi kesalahan.";
      if (options?.errorMessage) {
        msg = typeof options.errorMessage === "string" ? options.errorMessage : options.errorMessage(error);
      } else if (err instanceof ApiError) {
        msg = err.message;
      }
      
      if (!options?.disableErrorToast) {
        toast("error", msg);
      }
      options?.onError?.(error, variables);
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  return { mutate, isMutating };
}
