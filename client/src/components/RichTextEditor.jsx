import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import PropTypes from "prop-types";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from "lucide-react";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const buttons = [
    {
      icon: <Bold className="w-4 h-4" />,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: <Italic className="w-4 h-4" />,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      icon: <UnderlineIcon className="w-4 h-4" />,
      title: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
    },
    {
      icon: <Strikethrough className="w-4 h-4" />,
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
    },
    {
      icon: <Code className="w-4 h-4" />,
      title: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
    },
    {
      type: "divider",
    },
    {
      icon: <Heading1 className="w-4 h-4" />,
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="w-4 h-4" />,
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="w-4 h-4" />,
      title: "Heading 3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
    },
    {
      type: "divider",
    },
    {
      icon: <List className="w-4 h-4" />,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="w-4 h-4" />,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
    {
      type: "divider",
    },
    {
      icon: <AlignLeft className="w-4 h-4" />,
      title: "Align Left",
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: <AlignCenter className="w-4 h-4" />,
      title: "Align Center",
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: <AlignRight className="w-4 h-4" />,
      title: "Align Right",
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
    },
    {
      icon: <AlignJustify className="w-4 h-4" />,
      title: "Align Justify",
      action: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: editor.isActive({ textAlign: 'justify' }),
    },
    {
      type: "divider",
    },
    {
      icon: <Quote className="w-4 h-4" />,
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
    },
    {
      icon: <Minus className="w-4 h-4" />,
      title: "Horizontal Rule",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      type: "divider",
    },
    {
      icon: <Undo className="w-4 h-4" />,
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().chain().focus().undo().run(),
    },
    {
      icon: <Redo className="w-4 h-4" />,
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().chain().focus().redo().run(),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50/50">
      {buttons.map((btn, index) => {
        if (btn.type === "divider") {
          return <div key={index} className="w-px h-6 bg-gray-300 mx-1" />;
        }
        return (
          <button
            key={index}
            onClick={btn.action}
            disabled={btn.disabled}
            className={`p-2 rounded-lg transition-colors duration-200 ${btn.isActive
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              } ${btn.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            title={btn.title}
            type="button"
          >
            {btn.icon}
          </button>
        );
      })}
    </div>
  );
};

MenuBar.propTypes = {
  editor: PropTypes.object,
};

const RichTextEditor = ({ content, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: placeholder || "Start writing your amazing content...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline cursor-pointer hover:text-primary-light",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] max-w-none p-4",
      },
    },
  });

  // Update editor content when `content` prop changes (handles async loads)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = content || "";
    if (incoming !== current) {
      // Use setContent to update editor without triggering selection resets
      try {
        editor.commands.setContent(incoming);
      } catch (err) {
        console.warn("Failed to set editor content:", err);
      }
    }
  }, [editor, content]);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="rich-text-editor" />
    </div>
  );
};

RichTextEditor.propTypes = {
  content: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default RichTextEditor;
