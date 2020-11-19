import cl from "./Label.module.css";

const Label = ({ text, size }) => {
  return (
    <label style={{ fontSize: size + "px" }} className={cl.descript}>
      {text}
    </label>
  );
};

export { Label };
