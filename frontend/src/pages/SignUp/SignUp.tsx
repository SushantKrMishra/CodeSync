import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Button,
  Card,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ApplyModal from "../../components/ApplyingModal";
import { validateEmailId } from "../../domain/utils";
import { SignUpFormState, useSignup } from "./hooks";

export default function SignUp() {
  const navigate = useNavigate();
  const { invoke, isError, isPending, isSuccess } = useSignup();

  const onSignupClick = (payload: SignUpFormState) => {
    invoke(payload);
    if (isSuccess) {
      navigate("/");
    }
  };

  return (
    <SignUpView
      navigate={navigate}
      onSignup={onSignupClick}
      isError={isError}
      isPending={isPending}
    />
  );
}

type ViewProps = {
  navigate: NavigateFunction;
  onSignup: (payload: SignUpFormState) => void;
  isError: boolean;
  isPending: boolean;
};

const initialFormState: SignUpFormState = {
  firstName: "",
  lastName: "",
  emailId: "",
  password: "",
};

const SignUpView: React.FC<ViewProps> = ({
  navigate,
  onSignup,
  isError,
  isPending,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState<SignUpFormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<SignUpFormState>>({});
  const [errorOpen, setErrorOpen] = useState(false);

  const handleChange = (key: keyof SignUpFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const onSignupClick = () => {
    const newErrors: Partial<SignUpFormState> = {};

    if (!formState.firstName) {
      newErrors.firstName = "⚠ Please enter your first name";
    }

    if (!formState.emailId) {
      newErrors.emailId = "⚠ Please enter an email Id!";
    } else if (!validateEmailId(formState.emailId)) {
      newErrors.emailId = "❌ Please enter a valid email Id!";
    }

    if (!formState.password) {
      newErrors.password = "⚠ Please enter your password!";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    onSignup(formState);
  };

  useEffect(() => {
    if (isError) {
      setErrorOpen(true);
    }
  }, [isError]);

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#d8dada",
          marginTop: "1.5rem",
        }}
      >
        <Card
          variant="outlined"
          className="w-96 p-6 text-center shadow-lg bg-white rounded-lg"
        >
          <div className="text-4xl   text-gray-900 font-semibold">Signup</div>

          <Box sx={{ marginX: "2rem", marginBottom: "1rem" }}>
            <div className="my-4">
              <TextField
                label="First name"
                variant="standard"
                className="w-full"
                value={formState.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                InputLabelProps={{
                  sx: {
                    color: "#212121",
                    "&.Mui-focused": { color: "#212121" },
                  },
                }}
              />
              {errors?.firstName && (
                <div className="mt-2 bg-red-100 text-red-700 px-3 py-2 text-sm rounded-md border border-red-300 shadow-sm">
                  {errors.firstName}
                </div>
              )}
            </div>

            <div className="my-4">
              <TextField
                label="Last Name"
                variant="standard"
                className="w-full"
                value={formState.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                InputLabelProps={{
                  sx: {
                    color: "#212121",
                    "&.Mui-focused": { color: "#212121" },
                  },
                }}
              />
              {errors?.lastName && (
                <div className="mt-2 bg-red-100 text-red-700 px-3 py-2 text-sm rounded-md border border-red-300 shadow-sm">
                  {errors.lastName}
                </div>
              )}
            </div>

            <TextField
              label="Email Id"
              variant="standard"
              className="w-full"
              value={formState.emailId}
              onChange={(e) => handleChange("emailId", e.target.value)}
              InputLabelProps={{
                sx: {
                  color: "#212121",
                  "&.Mui-focused": { color: "#212121" },
                },
              }}
            />
            {errors?.emailId && (
              <div className="mt-2 bg-red-100 text-red-700 px-3 py-2 text-sm rounded-md border border-red-300 shadow-sm">
                {errors.emailId}
              </div>
            )}

            <FormControl
              sx={{ my: "1.5rem", width: "100%" }}
              variant="standard"
            >
              <InputLabel
                htmlFor="standard-adornment-password"
                sx={{
                  color: "#212121",
                  "&.Mui-focused": { color: "#212121" },
                }}
              >
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={showPassword ? "text" : "password"}
                value={formState.password}
                onChange={(e) => handleChange("password", e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "Hide the password" : "Show the password"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{
                  "&:before": { borderBottom: "1px solid #212121" },
                  "&:hover:not(.Mui-disabled):before": {
                    borderBottom: "1px solid #212121",
                  },
                  "&.Mui-focused:before": { borderBottom: "2px solid #212121" },
                }}
              />
              {errors?.password && (
                <div className="mt-2 bg-red-100 text-red-700 px-3 py-2 text-sm rounded-md border border-red-300 shadow-sm">
                  {errors.password}
                </div>
              )}
            </FormControl>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#212121",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#333333",
                },
                width: "100%",
                padding: "0.8rem",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "8px",
              }}
              onClick={onSignupClick}
            >
              Sign up
            </Button>
            <Typography
              sx={{
                marginTop: "1rem",
                textAlign: "center",
                fontSize: "0.9rem",
                color: "#212121",
              }}
            >
              Already have a account?
              <span
                style={{
                  color: "#1976d2",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/login")}
                className="ps-2"
              >
                Login here
              </span>
            </Typography>
          </Box>
        </Card>
      </Box>

      <ApplyModal show={isPending} message="Processing your request..." />

      {/* Error Snackbar */}
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
          Signup failed! Please try again.
        </Alert>
      </Snackbar>
    </>
  );
};
