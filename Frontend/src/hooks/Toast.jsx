import { toast, Slide } from 'react-toastify';

export function useToast() {
  const showToast = (message, type) => {
    const Options = {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    };
    switch (type) {
      case 'success':
        toast.success(message, Options);
        break;
      case 'error':
        toast.error(message, Options);
        break;
      default:
        toast(message, Options);
    }
  };

  return showToast;
}