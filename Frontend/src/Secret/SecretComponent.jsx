import React, { useState } from "react";
import { Header } from "../Header/Header";
import SecretsTableComponent from "../commonComponents/SecretsTable"
import SecretStoreForm from "./SecretStoreForm";

export const SecretComponent = () => {
  const [closeStoreTab, setCloseStoreTab] = useState(false);

  console.log(closeStoreTab, "closeStoreTab")
  return (
    <div>
      <Header />
      {!closeStoreTab && (
        <div className="flex justify-between p-2">
          <p className="text-2xl">Secrets</p>
          <button className="px-10 py-3 bg-red-500 rounded-md text-[16px]" onClick={() => { setCloseStoreTab(true) }}>Add+</button>
        </div>
      )}
      {!closeStoreTab && (<SecretsTableComponent />)}

      <SecretStoreForm closeStoreTab={closeStoreTab} setCloseStoreTab={setCloseStoreTab} />
    </div>
  );
};
