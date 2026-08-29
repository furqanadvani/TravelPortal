import { Select } from "antd";
import "./CSelect.css";

const CSelect = ({
    data = [],
    title,
    placeholder,
    name,
    className = "",
    label,
    value,
    error,
    onChange,
    loading = false,
    disabled = false,
    mode,
    allowClear = true,
    onSearch,
    filterOption,
    showSearch = true,
}) => {

    const isMultiple = mode === "multiple" || mode === "tags";

    const handleChange = (val) => {
        const finalValue = isMultiple
            ? Array.isArray(val) ? val : []
            : val;

        if (onChange) {
            onChange(finalValue, name);
        }
    };

    const selectedValue = isMultiple
        ? Array.isArray(value) ? value : []
        : value ?? undefined;

    return (
        <div className="select-dropdown-main">
            {label && (
                <label htmlFor={name} className="form-label">
                    {label}
                </label>
            )}

            <Select
                name={name}
                mode={mode}
                allowClear={allowClear}
                placeholder={placeholder || title}
                value={selectedValue}
                onChange={handleChange}
                className={`select-dropdown ${className} ${error ? "select-error-border" : ""}`}
                loading={loading}
                disabled={disabled || loading}
                showSearch={showSearch}
                onSearch={onSearch}
                filterOption={filterOption ?? ((input, option) =>
                    (option?.searchText ?? "").toLowerCase().includes(input.toLowerCase())
                )}
                notFoundContent={loading ? "Loading..." : "No options found"}
            >
                {data?.map((item) => {
                    const optionValue = item.key ?? item._id ?? item.value ?? item.label;
                    const firstLast = [item.firstName, item.lastName].filter(Boolean).join(" ");
                    const optionLabel = item.label || firstLast || item.name || "";

                    return (
                        <Select.Option key={optionValue} value={optionValue} searchText={optionLabel}>
                            <div className="icons-main">
                                {item.icon && <i>{item.icon}</i>}
                                <span>{optionLabel}</span>
                            </div>
                        </Select.Option>
                    );
                })}
            </Select>

            {error && <span className="form-error">{error}</span>}
        </div>
    );
};

export default CSelect;