import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface UserForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface EditUserProps {
  userId: string;
  onUserUpdated?: () => void;
  onClose: () => void;
}

export function EditUser({ userId, onUserUpdated, onClose }: EditUserProps) {
  // Estado del formulario con datos del usuario
  const [formData, setFormData] = useState<UserForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Estado que indica si el formulario está enviándose
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para mensajes de error
  const [error, setError] = useState("");

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setFormData(userDoc.data() as UserForm);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Error al cargar los datos del usuario");
      }
    };

    fetchUserData();
  }, [userId]);

  /**
   * Maneja cambios en los inputs del formulario
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Maneja el envío del formulario para actualizar el usuario
   * @param {React.FormEvent} e - Evento de envío del formulario
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validación básica
    if (!formData.name || !formData.email) {
      setError("Nombre y email son requeridos");
      return;
    }

    setIsSubmitting(true);

    try {
      // Actualizar en Firestore
      await updateDoc(doc(db, "users", userId), { ...formData });
      // Callback después de éxito
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      setError("Error al actualizar el usuario");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 p-4 rounded-lg max-w-lg w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Editar Usuario</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl font-bold cursor-pointer hover:text-gray-300"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Nombre*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-1">Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-1">Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-white"
            />
          </div>

          <div>
            <label className="block text-white mb-1">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-white"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg font-semibold text-white ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}