import FiltroBusqueda from "./FiltroBusqueda";
import ImpresionesHeader from "./ImpresionesHeader";
import PreciosImpresion from "./PreciosImpresion";
import TablaImpresiones from "./TablaImpresiones";
import { NoteProvider  } from "../../Context/NoteContext";

export default function ImpresionesPage() {
    return(
        <>
        <NoteProvider>
            <ImpresionesHeader/>
            <PreciosImpresion/>
            <FiltroBusqueda/>
            <TablaImpresiones/>
        </NoteProvider>
        </>
    )
}