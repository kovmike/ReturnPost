import cl from "./Label.module.css";

const Label = ({ text }) => {
  return <label className={cl.descript}>{text}</label>;
};

export { Label };
