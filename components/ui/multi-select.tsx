import React, { useState, useCallback } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { StylesConfig } from 'react-select';

export type OptionType = { label: string; value: string };

interface Props {
    loadOptions: (inputValue: string) => Promise<OptionType[]>;
    onChange: (selected: OptionType[]) => void;
    value: OptionType[];
    placeholder?: string;
    isClearable?: boolean;
    isDisabled?: boolean;
    className?: string;
    isLoading?: boolean;
    createOptionApi?: (inputValue: string) => Promise<OptionType>;
    theme?: 'light' | 'dark';
    onCreateRequest?: (inputValue: string) => void;
    componentkey?: number;
    options?: OptionType[];
}

const lightThemeColors = {
    background: '#fff',
    text: '#1f2937', // gray-800
    border: '#d1d5db', // gray-300
    primary: '#6366f1', // indigo-500
    primaryLight: '#e0e7ff', // indigo-100
    hoverBg: '#eef2ff', // indigo-50
    multiValueBg: '#e0e7ff',
    multiValueText: '#4338ca', // indigo-700
    multiValueRemoveHover: '#c7d2fe',
    menuBg: '#fff',
    menuShadow: 'rgba(0, 0, 0, 0.1)',
};

const darkThemeColors = {
    background: '#1f2937', // gray-800
    text: '#f9fafb', // gray-50
    border: '#374151', // gray-700
    primary: '#8b5cf6', // violet-500
    primaryLight: '#c4b5fd', // violet-300
    hoverBg: '#4c1d95', // violet-900
    multiValueBg: '#5b21b6',
    multiValueText: '#e0e7ff', // indigo-100
    multiValueRemoveHover: '#7c3aed',
    menuBg: '#111827', // gray-900
    menuShadow: 'rgba(0, 0, 0, 0.8)',
};

const getStyles = (themeColors: typeof lightThemeColors): StylesConfig<OptionType, true> => ({
    control: (base, state) => ({
        ...base,
        backgroundColor: themeColors.background,
        borderColor: state.isFocused ? themeColors.primary : themeColors.border,
        boxShadow: state.isFocused ? `0 0 0 2px ${themeColors.primaryLight}` : 'none',
        '&:hover': { borderColor: themeColors.primary },
        borderRadius: 10,
        padding: '4px 8px',
        minHeight: 44,
        fontSize: 14,
        color: themeColors.text,
    }),
    input: (base) => ({
        ...base,
        color: themeColors.text,
        margin: 0,
        padding: 0,
    }),
    placeholder: (base) => ({
        ...base,
        color: themeColors.text + '99', // add some transparency
        fontWeight: 500,
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: themeColors.multiValueBg,
        borderRadius: 8,
        color: themeColors.multiValueText,
        fontWeight: 600,
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: themeColors.multiValueText,
        padding: '2px 6px',
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: themeColors.multiValueText,
        borderRadius: 8,
        ':hover': {
            backgroundColor: themeColors.multiValueRemoveHover,
            color: themeColors.background,
            cursor: 'pointer',
        },
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: themeColors.menuBg,
        borderRadius: 10,
        marginTop: 4,
        boxShadow: `0 8px 16px ${themeColors.menuShadow}`,
        zIndex: 9999,
    }),
    menuList: (base) => ({
        ...base,
        paddingTop: 4,
        paddingBottom: 4,
        maxHeight: 240,
        scrollbarWidth: 'thin',
        scrollbarColor: `${themeColors.primary} transparent`,
        '&::-webkit-scrollbar': {
            width: 6,
            height: 6,
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: themeColors.primary,
            borderRadius: 3,
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
        },
    }),
    option: (base, { isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected
            ? themeColors.primary
            : isFocused
                ? themeColors.hoverBg
                : 'transparent',
        color: isSelected ? themeColors.background : themeColors.text,
        padding: '8px 12px',
        cursor: 'pointer',
        fontWeight: isSelected ? '700' : '400',
        transition: 'background-color 0.2s ease',
    }),
    clearIndicator: (base) => ({
        ...base,
        color: themeColors.primary,
        ':hover': { color: themeColors.primaryLight },
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: themeColors.primary,
        ':hover': { color: themeColors.primaryLight },
    }),
});

const CreatableAsyncMultiSelect: React.FC<Props> = ({
    loadOptions,
    onChange,
    value,
    componentkey,
    placeholder = 'Select or create...',
    isClearable = true,
    isDisabled = false,
    isLoading = false,
    className = '',
    createOptionApi,
    onCreateRequest,
    theme = 'dark',
    options = [],
}) => {
    const [createdOptions, setCreatedOptions] = useState<OptionType[]>([]);

    const themeColors = theme === 'dark' ? darkThemeColors : lightThemeColors;
    const styles = getStyles(themeColors);

    const loadOptionsWithCache = useCallback(
        async (inputValue: string) => {
            const apiOptions = await loadOptions(inputValue);

            const filteredCreated = createdOptions.filter((o) =>
                o.label.toLowerCase().includes(inputValue.toLowerCase())
            );

            const merged = [...apiOptions, ...filteredCreated].filter(
                (opt, idx, arr) => arr.findIndex((o) => o.value === opt.value) === idx
            );

            return merged;
        },
        [loadOptions, createdOptions]
    );



    return (
        <div className={`w-full ${className}`}>
            <AsyncCreatableSelect
                key={componentkey}
                isMulti
                defaultOptions

                loadOptions={loadOptionsWithCache}
                options={options}
                onChange={(val) => onChange(val as OptionType[])}
                onCreateOption={(inputValue) => {
                    if (onCreateRequest) {
                        onCreateRequest(inputValue);
                    }
                    const newOption = { label: inputValue, value: inputValue.toLowerCase() };
                    onChange([...value, newOption]);
                }}
                value={value}
                placeholder={placeholder}
                isClearable={isClearable}
                isDisabled={isDisabled}
                styles={styles}
                isLoading={isLoading}
                theme={(baseTheme) => ({
                    ...baseTheme,
                    colors: {
                        ...baseTheme.colors,
                        primary: themeColors.primary,
                        primary75: themeColors.primaryLight,
                        primary50: themeColors.primaryLight,
                        primary25: themeColors.hoverBg,
                        neutral80: themeColors.text,
                        neutral20: themeColors.border,
                        neutral10: themeColors.border,
                    },
                })}
            />
        </div>
    );
};

export default CreatableAsyncMultiSelect;
