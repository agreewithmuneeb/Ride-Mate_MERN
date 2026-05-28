import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/api";
import Loader from "../../components/Loader";
import { RideFormPage } from "./CreateRide";

export default function EditRide() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    api.get(`/rides/${id}`).then((data) => {
      setRide({
        origin: data.origin || "",
        destination: data.destination || "",
        date: data.date ? data.date.slice(0, 16) : "",
        seats: data.seats || 1,
        price: data.price || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      });
    });
  }, [id]);

  if (!ride) return <Loader label="Loading ride" />;
  return <RideFormPage title="Edit Ride" mode="edit" initial={ride} rideId={id} />;
}
