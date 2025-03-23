import { Description, Save, UploadFile } from "@mui/icons-material";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplyModal from "../../components/ApplyingModal";
import ErrorIndicator from "../../components/ErrorIndicator";
import { PostFormState, useCreatePost } from "./hooks";

export const AddPostPage = () => {
  const { invoke, isError, isPending } = useCreatePost();
  const navigate = useNavigate();

  const handleSubmit = async (content: string, imageFile?: File) => {
    await invoke({ content, imageFile });
    navigate("/profile");
  };

  if (isError) {
    return <ErrorIndicator />;
  }

  return <AddPostPageView onSubmit={handleSubmit} isSubmitting={isPending} />;
};

const initialFormState: PostFormState = {
  content: "",
};

const AddPostPageView = ({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (content: string, imageFile?: File) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const [formState, setFormState] = useState<PostFormState>(initialFormState);
  const [errors, setErrors] = useState<{ content?: string; image?: string }>(
    {}
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formState.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await onSubmit(formState.content, selectedFile ?? undefined);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
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
            Create New Post
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
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadFile />}
                  sx={{ borderRadius: "12px", textTransform: "none" }}
                >
                  Upload Image
                </Button>
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-full max-h-64 object-contain rounded-lg shadow"
                />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
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
                  Create Post
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <ApplyModal show={isSubmitting} message="Crafting your post..." />
    </>
  );
};
