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
import { LoginFormState, useLogin } from "./hooks";

export default function Login() {
  const { invoke, isError, isPending } = useLogin();
  const navigate = useNavigate();

  const onLogin = (data: LoginFormState) => {
    invoke(data);
    navigate("/");
  };

  return (
    <LoginView
      onSuccessfulValidation={onLogin}
      isPending={isPending}
      isError={isError}
      navigate={navigate}
    />
  );
}

type ViewProps = {
  onSuccessfulValidation: (formState: LoginFormState) => void;
  isPending: boolean;
  isError: boolean;
  navigate: NavigateFunction;
};

const initialFormState: LoginFormState = {
  emailId: "",
  password: "",
};

const LoginView: React.FC<ViewProps> = ({
  onSuccessfulValidation,
  isPending,
  isError,
  navigate,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState<LoginFormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<LoginFormState>>({});
  const [errorOpen, setErrorOpen] = useState(false);

  const handleChange = (key: keyof LoginFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const onLoginClick = () => {
    const newErrors: Partial<LoginFormState> = {};

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

    onSuccessfulValidation(formState);
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
        }}
      >
        <Card
          variant="outlined"
          className="w-96 m-4 p-6 text-center shadow-lg bg-white rounded-lg"
        >
          <div className="text-4xl my-3 mb-6 text-gray-900 font-semibold">
            Login
          </div>

          <Box sx={{ marginX: "2rem", marginBottom: "1rem" }}>
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
              onClick={onLoginClick}
            >
              Login
            </Button>
            <Typography
              sx={{
                marginTop: "1rem",
                textAlign: "center",
                fontSize: "0.9rem",
                color: "#212121",
              }}
            >
              New user?
              <span
                style={{
                  color: "#1976d2",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/signup")}
                className="ps-2"
              >
                Create your account here
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
          Login failed! Please try again.
        </Alert>
      </Snackbar>
    </>
  );
};
