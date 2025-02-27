import {
  IconButton,
  Popover,
  Backdrop,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useMapType } from "./Map";
import L from "leaflet";
import { useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import { startCase } from "lodash";
import { mapTypes, useMapType } from "./Map";

const MapTypeMenu = () => {
  const [open, setOpen] = useState(false);
  const settingsButtonRef = useRef(null);

  const [mapType, setMapType] = useMapType();
  useEffect(() => {
    if (mapType === "leaflet") {
      const leafletMap = L.map("mapId").setView([51.505, -0.09], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMap);
    }
  }, [mapType]);
  return (
    <>
      <IconButton
        ref={settingsButtonRef}
        sx={{ ml: "auto" }}
        color={open ? "grey" : "initial"}
        onClick={() => setOpen(true)}
      >
        <MdSettings />
      </IconButton>
      <Backdrop open={open} sx={{ zIndex: 1000 }} />
      <Popover
        open={open}
        anchorEl={settingsButtonRef?.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <FormControl sx={{ m: 2 }}>
          <FormLabel>Active map library</FormLabel>
          <RadioGroup
            value={mapType}
            onChange={(evt) => {
              setMapType(evt.target.value);
            }}
          >
            {mapTypes.map((type) => (
              <FormControlLabel
                key={type}
                value={type}
                control={<Radio />}
                label={startCase(type)}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Popover>
    </>
  );
};
export default MapTypeMenu;
