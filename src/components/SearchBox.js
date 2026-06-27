import Select from "react-select";

export default function SearchBox({ value, setValue, stations, placeholder }) {
  const options = stations.map((item) => ({
    label: item,
    value: item,
  }));

  return (
    <Select
      options={options}
      value={
        value
          ? {
              label: value,
              value: value,
            }
          : null
      }
      onChange={(e) => setValue(e.value)}
      placeholder={placeholder}
      className="metro-search"
    />
  );
}

