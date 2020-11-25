const CheckBox = ({ handler, checked }) => {
  return (
    <div>
      <input type="checkbox" id="defect" onChange={handler} checked={checked} />
      <label for="defect">Дефектная</label>
    </div>
  );
};

export { CheckBox };
