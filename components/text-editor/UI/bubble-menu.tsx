import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Type, Palette, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Editor } from '@tiptap/core';
import { offset } from '@floating-ui/dom'
import { BubbleMenu } from '@tiptap/react/menus';

const EditorBubbleMenu = ({ editor, isVisible = true, position = { x: 0, y: 0 } }: {
    editor: Editor,
    isVisible?: boolean,
    position?: { x: number, y: number }
}) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showFontSize, setShowFontSize] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [selectedFontSize, setSelectedFontSize] = useState('16');

    const menuRef = useRef(null);

    const colors = [
        '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
        '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000',
        '#FFC0CB', '#A52A2A', '#808080', '#000080', '#800000'
    ];

    const fontSizes = ['12', '14', '16', '18', '20', '24', '28', '32', '36', '42', '48'];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowColorPicker(false);
                setShowFontSize(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBold = () => {
        editor.chain().focus().toggleBold().run();
    };

    const handleItalic = () => {
        editor.chain().focus().toggleItalic().run();
    };

    const handleUnderline = () => {
        editor.chain().focus().toggleUnderline().run();
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        editor.chain().focus().setColor(color).run();
        setShowColorPicker(false);
    };

    const handleFontSizeChange = (size: string) => {
        setSelectedFontSize(size);
        editor.chain().focus().setFontSize(size + 'px').run();
        setShowFontSize(false);
    };

    const handleAlign = (alignment) => {
        editor.chain().focus().setTextAlign(alignment).run();
    };

    if (!isVisible) return null;

    return (

        <BubbleMenu
            shouldShow={({ editor }) => {
                return editor &&
                    editor.state &&
                    editor.state.selection &&
                    editor.state.selection.content()
                    ? editor.state.selection.content().size > 0
                    : false
            }}
            editor={editor}
            options={{

                placement: 'top',
            }} >
            <div
                ref={menuRef}
                className="bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex items-center gap-0.5 animate-in fade-in duration-200"
                style={{ backdropFilter: 'blur(8px)' }}
            >

                <button
                    type='button'
                    onClick={handleBold}
                    className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                        }`}
                    title="Bold"
                >
                    <Bold size={16} />
                </button>

                {/* Italic Button */}
                <button
                    type='button'
                    onClick={handleItalic}
                    className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                        }`}
                    title="Italic"
                >
                    <Italic size={16} />
                </button>

                {/* Underline Button */}
                <button
                    type='button'
                    onClick={handleUnderline}
                    className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                        }`}
                    title="Underline"
                >
                    <Underline size={16} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Font Size Dropdown */}
                <div className="relative">
                    <button
                        type='button'
                        onClick={() => {
                            setShowFontSize(!showFontSize);
                            setShowColorPicker(false);
                        }}
                        className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-700 flex items-center gap-1"
                        title="Font Size"
                    >
                        <Type size={16} />
                        <span className="text-xs">{selectedFontSize}</span>
                    </button>

                    {showFontSize && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-1 min-w-[60px] z-10">
                            <div className="max-h-32 overflow-y-auto">
                                {fontSizes.map((size) => (
                                    <button
                                        type='button'
                                        key={size}
                                        onClick={() => handleFontSizeChange(size)}
                                        className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${selectedFontSize === size ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                                            }`}
                                    >
                                        {size}px
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Color Picker */}
                <div className="relative">
                    <button
                        type='button'
                        onClick={() => {
                            setShowColorPicker(!showColorPicker);
                            setShowFontSize(false);
                        }}
                        className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-700 flex items-center"
                        title="Text Color"
                    >
                        <Palette size={16} />
                        <div
                            className="w-3 h-3 rounded-full ml-1 border border-gray-300"
                            style={{ backgroundColor: selectedColor }}
                        />
                    </button>

                    {showColorPicker && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 z-10">
                            <div className="grid grid-cols-5 gap-1 w-32">
                                {colors.map((color) => (
                                    <button
                                        type='button'
                                        key={color}
                                        onClick={() => handleColorChange(color)}
                                        className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${selectedColor === color ? 'border-blue-500' : 'border-gray-300'
                                            }`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Text Alignment */}
                <button
                    type='button'
                    onClick={() => handleAlign('left')}
                    className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                        }`}
                    title="Align Left"
                >
                    <AlignLeft size={16} />
                </button>

                <button
                    type='button'
                    onClick={() => handleAlign('center')}
                    className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                        }`}
                    title="Align Center"
                >
                    <AlignCenter size={16} />
                </button>

                <button
                    type='button'
                    onClick={() => handleAlign('right')}
                    className={`p-2 rounded hover:bg-gray-100 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                        }`}
                    title="Align Right"
                >
                    <AlignRight size={16} />
                </button>

            </div>

        </BubbleMenu>
    );
};


export default EditorBubbleMenu;