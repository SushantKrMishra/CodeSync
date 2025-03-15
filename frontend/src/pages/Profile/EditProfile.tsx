import {
  AlternateEmail,
  Cake,
  Info,
  Person,
  Save,
  Wc,
} from "@mui/icons-material";
import {
  Alert,
  Button,
  InputAdornment,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplyModal from "../../components/ApplyingModal";
import ErrorIndicator from "../../components/ErrorIndicator";
import LoadingIndicator from "../../components/LoadingIndicator";
import { getChangedFields } from "../../domain/utils";
import { UserProfile, useUpdateUserProfileInfo, useUserProfile } from "./hooks";

export const EditProfilePage = () => {
  const { data, isError, isPending } = useUserProfile();
  const {
    invoke,
    data: updateData,
    isPending: isUpdatePending,
    isError: isUpdateError,
    isSuccess,
  } = useUpdateUserProfileInfo();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess && typeof updateData !== "string") {
      navigate("/profile");
    }
  }, [updateData, navigate, isSuccess]);

  const onSave = async (formState: UserProfile) => {
    const changedValues = getChangedFields(data!, formState);
    if (Object.keys(changedValues).length > 0) {
      await invoke(changedValues);
    } else {
      navigate("/profile");
    }
  };

  if (isError) {
    return <ErrorIndicator />;
  }

  if (isPending || data === undefined) {
    return <LoadingIndicator />;
  }

  return (
    <EditProfilePageView
      user={data}
      onSave={onSave}
      isUpdating={isUpdatePending}
      error={updateData}
      isError={isUpdateError}
    />
  );
};

const EditProfilePageView = ({
  user,
  onSave,
  isUpdating,
  error,
  isError,
}: {
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
  isUpdating: boolean;
  error?: string | void;
  isError: boolean;
}) => {
  const [formState, setFormState] = useState<UserProfile>(user);
  const [errorOpen, setErrorOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    firstName?: string;
    age?: string;
  }>({});

  useEffect(() => {
    if (typeof error === "string") {
      setErrorOpen(true);
    }
    if (isError) {
      setErrorOpen(true);
    }
  }, [error, isError]);

  const validateForm = (): boolean => {
    const errors: typeof formErrors = {};

    if (formState.firstName.length < 3) {
      errors.firstName = "First name must be at least 3 characters";
    }

    if (formState.age <= 16) {
      errors.age = "Age must be greater than 16";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formState);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const sanitizers = {
    age: (input: string) => {
      const digitsOnly = input.replace(/\D/g, "");
      return digitsOnly === "" ? 0 : parseInt(digitsOnly, 10);
    },
    name: (input: string) => {
      return input.replace(/[^a-zA-Z-' ]/g, "").trimStart();
    },
    username: (input: string) => {
      return input.replace(/[^\w.]/g, "").toLowerCase();
    },
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
            Edit Profile
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
            className="grid gap-6 md:grid-cols-2 mt-8"
          >
            {[
              {
                label: "First name",
                field: "firstName",
                icon: <Person />,
                sanitize: sanitizers.name,
                error: formErrors.firstName,
                inputProps: { minLength: 3 },
              },
              {
                label: "Last name",
                field: "lastName",
                icon: <Person />,
                sanitize: sanitizers.name,
              },
              {
                label: "Username",
                field: "userName",
                icon: <AlternateEmail />,
                sanitize: sanitizers.username,
              },
              {
                label: "Age",
                field: "age",
                icon: <Cake />,
                placeholder: "Enter your age",
                sanitize: sanitizers.age,
                error: formErrors.age,
                inputProps: { min: 17 },
              },
              {
                label: "Gender",
                field: "gender",
                icon: <Wc />,
                select: true,
                options: ["Male", "Female"],
              },
            ].map(
              (
                {
                  label,
                  field,
                  icon,
                  placeholder,
                  select,
                  options,
                  sanitize,
                  error,
                  inputProps,
                },
                index
              ) => (
                <motion.div
                  key={field}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.3 }}
                  className="relative"
                >
                  <TextField
                    label={label}
                    variant="outlined"
                    fullWidth
                    select={select}
                    placeholder={placeholder}
                    value={formState[field as keyof UserProfile]}
                    onChange={(e) =>
                      handleChange(
                        field as keyof UserProfile,
                        sanitize ? sanitize(e.target.value) : e.target.value
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <motion.div whileHover={{ rotate: 15 }}>
                            {icon}
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
                    error={!!error}
                    helperText={error} // Changed from helperText={!!error}
                    inputProps={inputProps} // Also fix this line from slotProps
                  >
                    {select &&
                      options?.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                  </TextField>
                </motion.div>
              )
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="md:col-span-2"
            >
              <TextField
                label="About"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={formState.about || ""}
                onChange={(e) => handleChange("about", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <motion.div whileHover={{ rotate: 15 }}>
                        <Info />
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex justify-center"
          >
            <Button
              variant="contained"
              onClick={handleSubmit}
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
                Save Changes
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      <ApplyModal show={isUpdating} message="Processing your request..." />
      {errorOpen && (
        <Snackbar
          open={errorOpen}
          autoHideDuration={4000}
          onClose={() => setErrorOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setErrorOpen(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {isError
              ? "Something went wrong! Please try again..."
              : (error as string)}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
