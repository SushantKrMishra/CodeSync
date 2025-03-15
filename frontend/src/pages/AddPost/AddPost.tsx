import { AddPhotoAlternate, Description, Save } from "@mui/icons-material";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplyModal from "../../components/ApplyingModal";
import ErrorIndicator from "../../components/ErrorIndicator";
import { isValidUrl } from "../../domain/utils";
import { CreatePostFormState, useCreatePost } from "./hooks";

export const AddPostPage = () => {
  const { invoke, isError, isPending } = useCreatePost();
  const navigate = useNavigate();

  const handleSubmit = async (content: string, imageUrl?: string) => {
    console.log(content, imageUrl);
    await invoke({ content, imageUrl });
    navigate("/profile");
  };

  if (isError) {
    return <ErrorIndicator />;
  }

  return <AddPostPageView onSubmit={handleSubmit} isSubmitting={isPending} />;
};

const initialFormState: CreatePostFormState = {
  content: "",
};

const AddPostPageView = ({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (content: string, imageUrl?: string) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const [formState, setFormState] =
    useState<CreatePostFormState>(initialFormState);
  const [errors, setErrors] = useState<{
    content?: string;
    imageUrl?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formState.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (formState.imageUrl && !isValidUrl(formState.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await onSubmit(formState.content, formState.imageUrl);
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
              <TextField
                label="Image URL"
                variant="outlined"
                fullWidth
                value={formState.imageUrl ?? ""}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    imageUrl: e.target.value,
                  }))
                }
                error={!!errors.imageUrl}
                helperText={errors.imageUrl}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <motion.div whileHover={{ rotate: 15 }}>
                        <AddPhotoAlternate />
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
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Note: Image upload functionality is not yet implemented. We're
                working on it! We are supporting image URL as of now!
              </Typography>
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

      <ApplyModal show={isSubmitting} message="Creating your post..." />
    </>
  );
};
