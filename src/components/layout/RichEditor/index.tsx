import {
  Box,
  Divider,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { Editor } from "@tiptap/react";
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineOrderedList,
  AiOutlineRedo,
  AiOutlineStrikethrough,
  AiOutlineUndo,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import Tooltip from "../Tooltip";
import { EditorWrapper, TipTapEditor } from "./styles";

interface Props {
  editor: Editor | null;
}

export default function RichEditor({ editor }: Props) {
  return (
    <EditorWrapper variant="outlined">
      {editor && (
        <>
          <Box p={"10px"} sx={{ backgroundColor: grey["200"] }}>
            <Box display={"flex"} flexWrap="wrap" flexDirection={"row"} gap={1}>
              <Paper elevation={0} sx={{ width: "fit-content", p: "5px" }}>
                <ToggleButtonGroup color="primary">
                  <Tooltip title="Negrito" arrow>
                    <ToggleButton
                      value={"bold"}
                      selected={editor.isActive("bold")}
                      onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                      <AiOutlineBold />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Itálico" arrow>
                    <ToggleButton
                      value={"bold"}
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                      selected={editor.isActive("italic")}
                    >
                      <AiOutlineItalic />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Sublinhado" arrow>
                    <ToggleButton
                      value={"bold"}
                      onClick={() =>
                        editor.chain().focus().toggleStrike().run()
                      }
                      selected={editor.isActive("strike")}
                    >
                      <AiOutlineStrikethrough />
                    </ToggleButton>
                  </Tooltip>
                </ToggleButtonGroup>
              </Paper>
              <Divider flexItem orientation="vertical" />
              <Paper elevation={0} sx={{ width: "fit-content", p: "5px" }}>
                <ToggleButtonGroup color="primary" sx={{ flexWrap: "wrap" }}>
                  <ToggleButton
                    value={"bold"}
                    size="small"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    selected={editor.isActive("heading", { level: 1 })}
                  >
                    Título 1
                  </ToggleButton>
                  <ToggleButton
                    value={"bold"}
                    size="small"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    selected={editor.isActive("heading", { level: 2 })}
                  >
                    Título 2
                  </ToggleButton>
                  <ToggleButton
                    value={"bold"}
                    size="small"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    selected={editor.isActive("heading", { level: 3 })}
                  >
                    Título 3
                  </ToggleButton>
                  <ToggleButton
                    value={"bold"}
                    size="small"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    selected={editor.isActive("paragraph")}
                  >
                    Parágrafo
                  </ToggleButton>
                  <ToggleButton
                    value={"bold"}
                    size="small"
                    onClick={() =>
                      editor.chain().focus().toggleBlockquote().run()
                    }
                    selected={editor.isActive("blockquote")}
                  >
                    Citação
                  </ToggleButton>
                </ToggleButtonGroup>
              </Paper>
              <Divider flexItem orientation="vertical" />
              <Paper elevation={0} sx={{ width: "fit-content", p: "5px" }}>
                <ToggleButtonGroup color="primary">
                  <Tooltip title="Lista não ordenada" arrow>
                    <ToggleButton
                      value={"bold"}
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                      selected={editor.isActive("bulletList")}
                    >
                      <AiOutlineUnorderedList />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Lista ordenada" arrow>
                    <ToggleButton
                      value={"bold"}
                      onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                      }
                      selected={editor.isActive("orderedList")}
                    >
                      <AiOutlineOrderedList />
                    </ToggleButton>
                  </Tooltip>
                </ToggleButtonGroup>
              </Paper>
              <Divider flexItem orientation="vertical" />
              <Paper elevation={0} sx={{ width: "fit-content", p: "5px" }}>
                <ToggleButtonGroup color="primary">
                  <Tooltip title="Desfazer" arrow>
                    <ToggleButton value={"bold"}>
                      <AiOutlineUndo />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Refazer" arrow>
                    <ToggleButton value={"bold"}>
                      <AiOutlineRedo />
                    </ToggleButton>
                  </Tooltip>
                </ToggleButtonGroup>
              </Paper>
            </Box>
          </Box>
          <Divider color={blue["500"]} />
          <Box>
            <TipTapEditor
              editor={editor}
              theme="dark"
              placeholder="Digite aqui seu texto"
            />
          </Box>
        </>
      )}
    </EditorWrapper>
  );
}
