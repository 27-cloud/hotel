export default function InputForm({type,placeholder,value,handleChange}) {
  return (
   <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="px-4 py-2 bg-primary-800 rounded-md text-primary-50"
          required
        />
  );
}