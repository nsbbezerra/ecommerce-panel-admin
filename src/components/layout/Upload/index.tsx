import { Box, Chip, Stack } from "@mui/material";
import {
  DescriptionContainer,
  ImageDate,
  ImageName,
  UploadButtonsContainer,
  UploadContainer,
  UploadDescription,
  UploadImage,
  UploadImageContainer,
  UploadImageDescription,
} from "./style";
import { BsImages, BsCloudUpload, BsTrash } from "react-icons/bs";
import { blue, grey } from "@mui/material/colors";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "../Button";
import { useEffect, useMemo, useRef, useState } from "react";
import format from "date-fns/format";
import { filesize } from "filesize";
import { api } from "../../../configs/api";
import Swal from "sweetalert2";
import getErrorMessage from "../../../helpers/getMessageError";

interface Props {
  disabled?: boolean;
  name: string;
  to: "category" | "product";
  id: string;
  onFinish?: () => void;
  old?: string;
  oldId?: string;
}

export default function Upload({
  id,
  to,
  disabled = false,
  name,
  onFinish,
  old,
  oldId,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [status, setStatus] = useState<"warning" | "success" | "error">(
    "warning"
  );
  const [imageSize, setImageSize] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [statusForm, setStatusForm] = useState<"new" | "remove">("new");

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : undefined;
  }, [thumbnail]);

  function removeThumbnail() {
    URL.revokeObjectURL(thumbnail as any);
    setThumbnail(undefined);
    setStatus("warning");
  }
  function handleThumbnail(file: FileList | null) {
    if (file) {
      setThumbnail(file[0]);
    }
  }

  function calcSize(size: number): string {
    return filesize(size, { base: 2, standard: "jedec" }).toString();
  }

  function upload() {
    if (!thumbnail) {
      Swal.fire({
        title: "Atenção",
        text: "Não existe uma imagem para salvar",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    if (status === "error" && imageSize === 100) {
      Swal.fire({
        title: "Atenção",
        text: "Imagem muito grande",
        icon: "warning",
        confirmButtonColor: blue["500"],
      });
      return;
    }
    setIsLoading(true);
    const data = new FormData();
    data.append(name, thumbnail as Blob);
    api
      .post(`/thumbnail/update/${to}/${!id ? "none" : id}`, data)
      .then((response) => {
        setStatus("success");
        setIsLoading(false);
        Swal.fire({
          title: "Sucesso",
          text: response.data.message,
          icon: "success",
          confirmButtonColor: blue["500"],
        }).then((result) => {
          if (result.isConfirmed) {
            onFinish && onFinish();
          }
        });
      })
      .catch((error) => {
        setIsLoading(false);
        getErrorMessage({ error });
      });
  }

  function deleteThumbnail() {
    setIsDeleteLoading(true);
    api
      .post(`/thumbnail/delete-thumbnail/${to}/${id}`, {
        thumbnailId: oldId as string,
      })
      .then((response) => {
        Swal.fire({
          title: "Sucesso",
          text: response.data.message,
          icon: "success",
          confirmButtonColor: blue["500"],
        });
        setStatusForm("new");
        setIsDeleteLoading(false);
      })
      .catch((error) => {
        setIsDeleteLoading(false);
        getErrorMessage({ error });
      });
  }

  useEffect(() => {
    const size = filesize(!thumbnail ? 0 : thumbnail.size, {
      base: 2,
      standard: "jedec",
    });
    if (
      size.toString().toLowerCase().includes("mb") &&
      parseFloat(size as string) >= 1
    ) {
      setStatus("error");
      setImageSize(100);
    } else {
      setImageSize(parseFloat(size as string) / 10);
    }
  }, [thumbnail]);

  useEffect(() => {
    if (!oldId || !oldId.length) {
      setStatusForm("new");
    } else {
      setStatusForm("remove");
    }
  }, [oldId]);

  return (
    <UploadContainer disabled={disabled}>
      <UploadButtonsContainer
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
        flexWrap="wrap"
        gap={2}
      >
        <Box display={"flex"} gap={1} flexWrap="wrap">
          <input
            hidden
            accept="image/*"
            type="file"
            ref={inputRef}
            onChange={(e) => {
              handleThumbnail(e.target.files);
            }}
          />
          {statusForm === "new" ? (
            <>
              <Button
                variant="contained"
                startIcon={<BsImages />}
                disabled={disabled}
                onClick={() => inputRef.current && inputRef.current.click()}
              >
                Selecionar
              </Button>

              <Button
                variant="contained"
                startIcon={<BsCloudUpload />}
                color="success"
                disabled={disabled}
                onClick={upload}
                loading={isLoading}
              >
                Upload
              </Button>
            </>
          ) : (
            ""
          )}
          <Button
            variant="contained"
            startIcon={<BsTrash />}
            color="error"
            disabled={disabled}
            onClick={statusForm === "new" ? removeThumbnail : deleteThumbnail}
            loading={isDeleteLoading}
          >
            Remover
          </Button>
        </Box>
        {statusForm === "new" ? (
          <Stack direction={"row"} spacing={1} alignItems="center">
            <span style={{ fontSize: "13px", color: grey["600"] }}>
              {!thumbnail ? "0B" : calcSize(thumbnail.size)} / 1MB
            </span>{" "}
            <LinearProgress
              variant="determinate"
              value={imageSize}
              style={{
                width: "100px",
                height: 10,
                borderRadius: "5px",
                marginTop: "-2px",
              }}
              color={
                disabled
                  ? "inherit"
                  : imageSize === 100 && status === "error"
                  ? "error"
                  : "primary"
              }
            />
          </Stack>
        ) : (
          ""
        )}
      </UploadButtonsContainer>
      <LinearProgress
        variant="determinate"
        value={100}
        color={disabled ? "inherit" : "primary"}
      />
      {thumbnail ? (
        <UploadImageContainer>
          <UploadImage src={preview} />
          <DescriptionContainer>
            <ImageName>{thumbnail.name}</ImageName>
            <ImageDate>{format(new Date(), "dd/MM/yyyy")}</ImageDate>
            <Chip
              label={
                (status === "error" && "Erro") ||
                (status === "success" && "Sucesso") ||
                (status === "warning" && "Aguardando")
              }
              color={status}
              variant="filled"
            />
          </DescriptionContainer>
        </UploadImageContainer>
      ) : (
        <>
          {statusForm === "new" ? (
            <UploadImageDescription>
              <BsImages color={grey["500"]} fontSize={45} />
              <UploadDescription>Selecione uma imagem</UploadDescription>
            </UploadImageDescription>
          ) : (
            <UploadImageContainer>
              <UploadImage src={old} />
              <DescriptionContainer>
                <ImageName>{old}</ImageName>
              </DescriptionContainer>
            </UploadImageContainer>
          )}
        </>
      )}
    </UploadContainer>
  );
}
