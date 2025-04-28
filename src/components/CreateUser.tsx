import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";

interface UserForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function CreateUser({ onUserAdded }: { onUserAdded?: () => void }) {
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

  /**
   * Maneja cambios en los inputs del formulario
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Maneja el envío del formulario para crear un nuevo usuario
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
      // Guardar en Firestore
      await addDoc(collection(db, "users"), formData);
      // Resetear formulario
      setFormData({ name: "", email: "", phone: "", address: "" });
      // Callback después de éxito
      if (onUserAdded) onUserAdded();
    } catch (err) {
      setError("Error al crear el usuario");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-white mb-4">Crear Usuario</h2>

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

        <br />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg font-semibold text-white ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Guardando..." : "Guardar Usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}
