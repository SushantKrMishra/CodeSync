import {
  Close,
  Delete,
  Description,
  Save,
  UploadFile,
} from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApplyModal from "../../components/ApplyingModal";
import { EditNotAllowed } from "../../components/EditNotAllowed";
import ErrorIndicator from "../../components/ErrorIndicator";
import LoadingIndicator from "../../components/LoadingIndicator";
import { PostNotFound } from "../../components/PostNotFound";
import { PostFormState } from "../AddPost/hooks";
import { FeedPost } from "../Home/hooks";
import { usePost, useUpdatePost } from "./hooks";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isError, isFetching } = usePost(id);
  const {
    invoke,
    isError: isUpdateError,
    isPending: isSubmiting,
  } = useUpdatePost();

  const onCancelClick = () => {
    navigate(-1);
  };

  const onSubmit = async (formState: PostFormState) => {
    await invoke({ data: formState, id: id! });
    navigate(-1);
  };

  if (isError || isUpdateError) {
    return <ErrorIndicator />;
  }

  if (isFetching || data === undefined) {
    return <LoadingIndicator />;
  }

  if (id === undefined || id.trim() === "" || data === "not-found") {
    return <PostNotFound />;
  }

  if (!data.isEditingAllowed) {
    return <EditNotAllowed />;
  }

  return (
    <EditPostView
      data={data}
      onCancelClick={onCancelClick}
      isSubmitting={isSubmiting}
      onSubmit={onSubmit}
    />
  );
};

export default EditPost;

type Props = {
  data: FeedPost;
  onCancelClick: () => void;
  onSubmit: (formState: PostFormState) => void;
  isSubmitting: boolean;
};

const EditPostView: React.FC<Props> = ({
  data,
  onCancelClick,
  onSubmit,
  isSubmitting,
}) => {
  const [formState, setFormState] = useState<PostFormState>(data);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    content?: string;
    imageUrl?: string;
  }>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormState((prev) => ({ ...prev, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setFormState((prev) => ({ ...prev, imageFile: undefined }));
    setImagePreview(null);
  };

  useEffect(() => {
    if (data.imageUrl) {
      setImagePreview(data.imageUrl);
    }
  }, [data]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formState.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formState);
    }
  };

  return (
    <>
      <div className="p-4 flex items-center justify-center bg-[#d8dada]">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"
          />

          <Typography
            variant="h4"
            fontWeight={700}
            className="text-center text-gray-800"
            sx={{
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.025em",
            }}
          >
            Edit Post
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2 }}
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 w-24 mx-auto mt-2"
            />
          </Typography>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            className="mt-8 space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TextField
                label="Post Content"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={formState.content}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, content: e.target.value }))
                }
                error={!!errors.content}
                helperText={errors.content}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <motion.div whileHover={{ rotate: 15 }}>
                        <Description />
                      </motion.div>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&:hover fieldset": {
                      borderColor: "#6366f1",
                    },
                  },
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
                id="image-upload"
              />
              {imagePreview && (
                <div className="relative mt-2 w-full max-h-64 group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg shadow"
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <label htmlFor="image-upload">
                      <IconButton
                        component="span"
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                          },
                        }}
                      >
                        <UploadFile fontSize="small" />
                      </IconButton>
                    </label>
                    <IconButton
                      onClick={handleDeleteImage}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        },
                      }}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </div>
                </div>
              )}
              {!imagePreview && (
                <label htmlFor="image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<UploadFile />}
                    sx={{ borderRadius: "12px", textTransform: "none" }}
                  >
                    Add Image
                  </Button>
                </label>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-4"
            >
              <Button
                variant="outlined"
                onClick={onCancelClick}
                sx={{
                  border: "2px solid #ef4444",
                  borderRadius: "14px",
                  px: 6,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  color: "#ef4444",
                  "&:hover": {
                    border: "2px solid #dc2626",
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    color: "#dc2626",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 14px rgba(239, 68, 68, 0.15)",
                    transition: "all 0.3s ease",
                  },
                }}
                className="group"
              >
                <motion.span
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <Close className="group-hover:rotate-180 transition-transform text-red-500" />
                  Cancel
                </motion.span>
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  bgcolor: "#4f46e5",
                  backgroundImage:
                    "linear-gradient(45deg, #6366f1 0%, #8b5cf6 100%)",
                  borderRadius: "14px",
                  px: 6,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
                    transition: "all 0.3s ease",
                  },
                }}
                className="group"
              >
                <motion.span
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <Save className="group-hover:rotate-12 transition-transform" />
                  Save Post
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <ApplyModal show={isSubmitting} message="Saving your post..." />
    </>
  );
};
