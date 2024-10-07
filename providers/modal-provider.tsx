"use client";

import { StoreModal } from "@/components/models/store-models";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // This ensures no rendering happens until the component is mounted
  }

  return (
    <>
      <StoreModal />
    </>
  );
};
