import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  CheckSquare,
  Heading1,
  Heading2,
  Heading3,
  GripVertical,
  X,
} from 'lucide-react';
import { Block } from '../types';

interface BlockEditorProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (content: string) => void;
  onDelete: () => void;
  onSplit: (beforeContent: string, afterContent: string) => void;
  onMergeWithPrevious?: (content: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function BlockEditor({
  block,
  isSelected,
  onSelect,
  onChange,
  onDelete,
  onSplit,
  onMergeWithPrevious,
  onMoveUp,
  onMoveDown,
}: BlockEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: block.content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          const { from, to } = view.state.selection;
          const currentContent = editor?.getHTML() || '';
          const position = editor?.state.selection.$from.pos || 0;
          
          // Get content before and after cursor
          const beforeContent = currentContent.slice(0, position);
          const afterContent = currentContent.slice(position);
          
          onSplit(beforeContent, afterContent);
          return true;
        }

        if (event.key === 'Backspace' && editor?.state.selection.$from.pos === 1) {
          if (onMergeWithPrevious) {
            const content = editor?.getHTML() || '';
            onMergeWithPrevious(content);
            return true;
          }
        }
        
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const getPlaceholder = () => {
    switch (block.type) {
      case 'heading1':
        return 'Heading 1';
      case 'heading2':
        return 'Heading 2';
      case 'heading3':
        return 'Heading 3';
      default:
        return 'Type / for commands';
    }
  };

  return (
    <div
      className={`group relative flex items-start gap-2 p-2 rounded-lg transition-colors ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
      onClick={onSelect}
    >
      <div className="opacity-0 group-hover:opacity-100 flex flex-col items-center gap-1">
        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-grab">
          <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </button>
        {onMoveUp && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
          >
            ↑
          </button>
        )}
        {onMoveDown && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
          >
            ↓
          </button>
        )}
      </div>

      <div className="flex-1">
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none focus:outline-none"
          placeholder={getPlaceholder()}
        />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
      >
        <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </button>
    </div>
  );
}

interface EditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export function Editor({ blocks = [], onChange }: EditorProps) {
  const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(
    blocks[0]?.id || null
  );

  React.useEffect(() => {
    if (blocks.length === 0) {
      handleAddBlock();
    }
  }, []);

  const handleBlockChange = (blockId: string, content: string) => {
    onChange(
      blocks.map((block) =>
        block.id === blockId ? { ...block, content } : block
      )
    );
  };

  const handleAddBlock = (afterBlockId?: string, initialContent: string = '') => {
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type: 'paragraph',
      content: initialContent,
    };

    if (afterBlockId) {
      const index = blocks.findIndex((block) => block.id === afterBlockId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      onChange(newBlocks);
    } else {
      onChange([...blocks, newBlock]);
    }
    
    setSelectedBlockId(newBlock.id);
  };

  const handleSplitBlock = (blockId: string, beforeContent: string, afterContent: string) => {
    const currentBlock = blocks.find((block) => block.id === blockId);
    if (!currentBlock) return;

    const updatedBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, content: beforeContent } : block
    );
    
    const newBlockIndex = blocks.findIndex((block) => block.id === blockId);
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type: currentBlock.type,
      content: afterContent,
    };
    
    updatedBlocks.splice(newBlockIndex + 1, 0, newBlock);
    onChange(updatedBlocks);
    setSelectedBlockId(newBlock.id);
  };

  const handleMergeWithPrevious = (blockId: string, content: string) => {
    const blockIndex = blocks.findIndex((block) => block.id === blockId);
    if (blockIndex <= 0) return;

    const previousBlock = blocks[blockIndex - 1];
    const updatedBlocks = blocks.map((block) =>
      block.id === previousBlock.id
        ? { ...block, content: block.content + content }
        : block
    );
    
    onChange(updatedBlocks.filter((block) => block.id !== blockId));
    setSelectedBlockId(previousBlock.id);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (blocks.length > 1) {
      const blockIndex = blocks.findIndex((block) => block.id === blockId);
      const newBlocks = blocks.filter((block) => block.id !== blockId);
      onChange(newBlocks);
      
      // Select the previous block or the next one if it's the first block
      const newSelectedId = blocks[blockIndex - 1]?.id || blocks[blockIndex + 1]?.id;
      setSelectedBlockId(newSelectedId);
    }
  };

  const handleMoveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    onChange(newBlocks);
  };

  return (
    <div className="space-y-1">
      {blocks.map((block, index) => (
        <BlockEditor
          key={block.id}
          block={block}
          isSelected={selectedBlockId === block.id}
          onSelect={() => setSelectedBlockId(block.id)}
          onChange={(content) => handleBlockChange(block.id, content)}
          onDelete={() => handleDeleteBlock(block.id)}
          onSplit={(beforeContent, afterContent) =>
            handleSplitBlock(block.id, beforeContent, afterContent)
          }
          onMergeWithPrevious={
            index > 0 ? (content) => handleMergeWithPrevious(block.id, content) : undefined
          }
          onMoveUp={index > 0 ? () => handleMoveBlock(index, index - 1) : undefined}
          onMoveDown={
            index < blocks.length - 1
              ? () => handleMoveBlock(index, index + 1)
              : undefined
          }
        />
      ))}
    </div>
  );
}