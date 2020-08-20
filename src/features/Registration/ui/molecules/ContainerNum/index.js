import React from "react";

import { Input, Label } from "../../atoms";

export const ContainerNum = ({ handler, value, text }) => {
  return (
    <div>
      <Label text={text} />
      <Input handler={handler} onEnterPress={() => {}} disabled={true} value={value} />
      {/* <Button title={"Ввести"} disabled={false} handler={handler} /> */}
    </div>
  );
};
