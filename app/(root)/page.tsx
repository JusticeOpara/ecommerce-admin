"use client";

// import { Button } from "@/components/ui/button";

// import { UserButton } from "@clerk/nextjs"
import { Modal } from "@/components/ui/modal";

const SetupPage = () => {
  return (
    <>
      <div>
        {/* <UserButton /> */}
        <Modal
          title="test"
          description="test mode"
          isOpen={true}
          onClose={() => {}}
        >
          Childern
        </Modal>
        {/* <Button size="default"> Click Me </Button> */}
      </div>
    </>
  );
};

export default SetupPage;
