import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

function SubirArchivoUser(usuario) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const onSubmit = async (data) => {
    const Apretado = async () => {
      swalWithBootstrapButtons
        .fire({
          title: `¿Estás seguro que quieres CARGAR este archivo?`,
          text: "¡No podrás deshacer esto!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Confirmar",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            setLoading(true);
            const swalLoading = Swal.fire({
              title: "Procesando... ¡No cierre esta ventana!",
              allowOutsideClick: false,
              allowEscapeKey: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
            try {
              const response = await axios.post(
                "https://serpaadministracionback.onrender.com/uploads/upload-file",
                {
                  file: data.file[0],
                  userId: usuario.usuario._id,
                  tipo: 'comprobante'
                },
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              await axios.patch("https://serpaadministracionback.onrender.com/users/actualizar-fecha",{
                id:usuario.usuario._id,
                tipo: "comprobante"
              });
              setLoading(false);
              setSuccess(true);
            } catch (error) {
              setLoading(false);
              setError(true);
              setErrorMessage(error.message);
            }
            swalLoading.close();
          swalWithBootstrapButtons
            .fire(
              "¡Archivo CARGADO!",
              "Se cargó el archivo con éxito.",
              "success"
            )
            .then(() => {
              window.location.reload(true);
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
              "Cancelado",
              "¡Estuvo cerca!",
              "error"
              );
            window.location.reload(true)
          }
        });
    };
    setLoading(true);
    try {
      const response = await Apretado();
    } catch (error) {
      setLoading(false);
      setError(true);
      setErrorMessage(error.message);
    }
  };
  function handleFileInputChange(event) {
    const fileInput = event.target;
    const selectedFileName = fileInput.files[0]?.name || 'Seleccione archivo';
    fileInput.setAttribute("data-file-name", selectedFileName);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="formSubirArchivo">
        <div className="input-group w-100 mx-auto">
          <input
            type="file"
            className="form-control"
            {...register("file", { required: true })}
            data-file-name="Select File.."
            onChange={handleFileInputChange}
          />
          <button type="submit" className={success ? "btn btn-success" : "btn btn-personalizado"}>
            {loading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {!loading && !success && "Subir"}
            {success && (
              <>
                <span
                  className="me-2">
                  <i className="bi bi-check text-light"></i>
                </span>
              </>
            )}
          </button>
        </div>
        {errors.file && (
          <span className="text-danger fs-6">Seleccione un archivo.</span>
        )}
        {error && <p className="text-danger">{errorMessage}</p>}
      </form>
    </>
  );
}

export default SubirArchivoUser;