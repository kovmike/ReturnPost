const CheckBox = ({ handler, checked, text }) => {
  return (
    <div>
      <input type="checkbox" id="defect" onChange={handler} checked={checked} />
      <label for="defect">{text}</label>
    </div>
  );
};

export { CheckBox };
