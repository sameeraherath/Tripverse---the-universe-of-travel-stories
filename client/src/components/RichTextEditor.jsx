import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import PropTypes from "prop-types";

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
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
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
