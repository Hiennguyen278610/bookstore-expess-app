import { useState, useEffect } from "react"

interface Position {
  lat: number
  lng: number
}

interface GeoLocationState {
  location: Position | null
  error: string | null
  loading: boolean
}

export const useGeoLocation = () => {
  const [state, setState] = useState<GeoLocationState>({
    location: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState((prev) => ({
        ...prev,
        error: "Trình duyệt không hỗ trợ Geolocation",
        loading: false,
      }))
      return
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        error: null,
        loading: false,
      })
    }

    const handleError = (error: GeolocationPositionError) => {
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }))
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    })
  }, [])

  return state
}