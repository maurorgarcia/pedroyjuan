// ─── Catálogo jerárquico completo ─────────────────────────────────────────────
// Estructura: categoria → subcategoria → tipo
// Los ids se usan directamente en la URL: /perros/alimentos/secos

export interface TipoItem {
  id: string;
  label: string;
}

export interface Subcategoria {
  id: string;
  label: string;
  tipos: TipoItem[];
}

export interface Categoria {
  id: string;
  label: string;
  subcategorias: Subcategoria[];
}

export const CATALOG: Categoria[] = [
  {
    id: 'perros',
    label: 'Perros',
    subcategorias: [
      {
        id: 'alimentos',
        label: 'Alimentos',
        tipos: [
          { id: 'secos', label: 'Secos' },
          { id: 'humedos', label: 'Húmedos' },
          { id: 'medicados', label: 'Medicados' },
          { id: 'naturales', label: 'Naturales' },
          { id: 'snacks', label: 'Snacks y Premios' },
        ],
      },
      {
        id: 'higiene',
        label: 'Higiene & Cuidado',
        tipos: [
          { id: 'shampoo', label: 'Shampoo y Acondicionador' },
          { id: 'cepillos', label: 'Cepillos y Cardinas' },
          { id: 'dental', label: 'Cuidado Dental' },
          { id: 'lociones', label: 'Lociones y Colonias' },
          { id: 'paniales', label: 'Pañales' },
        ],
      },
      {
        id: 'accesorios',
        label: 'Accesorios',
        tipos: [
          { id: 'correas', label: 'Correas y Collares' },
          { id: 'camas', label: 'Camas y Mantas' },
          { id: 'juguetes', label: 'Juguetes' },
          { id: 'comederos', label: 'Comederos y Bebederos' },
          { id: 'ropa', label: 'Ropa' },
        ],
      },
      {
        id: 'salud',
        label: 'Salud',
        tipos: [
          { id: 'antiparasitarios', label: 'Antiparasitarios' },
          { id: 'antipulgas', label: 'Antipulgas' },
          { id: 'suplementos', label: 'Suplementos' },
          { id: 'medicamentos', label: 'Medicamentos' },
        ],
      },
    ],
  },
  {
    id: 'gatos',
    label: 'Gatos',
    subcategorias: [
      {
        id: 'alimentos',
        label: 'Alimentos',
        tipos: [
          { id: 'secos', label: 'Secos' },
          { id: 'humedos', label: 'Húmedos' },
          { id: 'kitten', label: 'Kitten' },
          { id: 'senior', label: 'Senior' },
          { id: 'snacks', label: 'Snacks y Premios' },
        ],
      },
      {
        id: 'higiene',
        label: 'Higiene & Cuidado',
        tipos: [
          { id: 'arena', label: 'Arena sanitaria' },
          { id: 'shampoo', label: 'Shampoo' },
          { id: 'cepillos', label: 'Cepillos' },
          { id: 'dental', label: 'Cuidado Dental' },
          { id: 'antiparasitarios', label: 'Antiparasitarios' },
        ],
      },
      {
        id: 'accesorios',
        label: 'Accesorios',
        tipos: [
          { id: 'juguetes', label: 'Juguetes' },
          { id: 'transportadoras', label: 'Transportadoras' },
          { id: 'camas', label: 'Camas y Escondites' },
          { id: 'rascadores', label: 'Rascadores' },
          { id: 'comederos', label: 'Comederos' },
        ],
      },
      {
        id: 'salud',
        label: 'Salud',
        tipos: [
          { id: 'suplementos', label: 'Suplementos' },
          { id: 'medicamentos', label: 'Medicamentos' },
          { id: 'pipetas', label: 'Pipetas' },
        ],
      },
    ],
  },
  {
    id: 'peces',
    label: 'Peces',
    subcategorias: [
      {
        id: 'alimentos',
        label: 'Alimentos',
        tipos: [
          { id: 'escamas', label: 'Escamas' },
          { id: 'pellets', label: 'Pellets' },
          { id: 'congelados', label: 'Congelados' },
          { id: 'pastillas', label: 'Pastillas de fondo' },
        ],
      },
      {
        id: 'acuarios',
        label: 'Acuarios & Equipos',
        tipos: [
          { id: 'tanques', label: 'Acuarios' },
          { id: 'filtros', label: 'Filtros' },
          { id: 'iluminacion', label: 'Iluminación' },
          { id: 'calefactores', label: 'Calefactores' },
          { id: 'oxigenadores', label: 'Oxigenadores' },
        ],
      },
      {
        id: 'decoracion',
        label: 'Decoración',
        tipos: [
          { id: 'sustratos', label: 'Sustratos' },
          { id: 'plantas', label: 'Plantas artificiales' },
          { id: 'adornos', label: 'Adornos' },
        ],
      },
      {
        id: 'salud',
        label: 'Salud',
        tipos: [
          { id: 'tratamientos', label: 'Tratamientos' },
          { id: 'acondicionadores', label: 'Acondicionadores' },
          { id: 'vitaminas', label: 'Vitaminas' },
        ],
      },
    ],
  },
  {
    id: 'aves',
    label: 'Aves',
    subcategorias: [
      {
        id: 'alimentos',
        label: 'Alimentos',
        tipos: [
          { id: 'semillas', label: 'Semillas' },
          { id: 'pellets', label: 'Pellets' },
          { id: 'frutas', label: 'Frutas deshidratadas' },
          { id: 'snacks', label: 'Snacks' },
        ],
      },
      {
        id: 'jaulas',
        label: 'Jaulas & Accesorios',
        tipos: [
          { id: 'jaulas', label: 'Jaulas' },
          { id: 'perchas', label: 'Perchas' },
          { id: 'comederos', label: 'Comederos' },
          { id: 'bebederos', label: 'Bebederos' },
          { id: 'juguetes', label: 'Juguetes' },
        ],
      },
      {
        id: 'higiene',
        label: 'Higiene & Salud',
        tipos: [
          { id: 'arena', label: 'Arena para jaulas' },
          { id: 'vitaminas', label: 'Vitaminas' },
          { id: 'antiparasitarios', label: 'Antiparasitarios' },
        ],
      },
    ],
  },
  {
    id: 'otras-especies',
    label: 'Otras Especies',
    subcategorias: [
      {
        id: 'roedores',
        label: 'Roedores',
        tipos: [
          { id: 'alimentos', label: 'Alimentos' },
          { id: 'jaulas', label: 'Jaulas' },
          { id: 'juguetes', label: 'Juguetes' },
          { id: 'bedding', label: 'Bedding y sustrato' },
        ],
      },
      {
        id: 'reptiles',
        label: 'Reptiles',
        tipos: [
          { id: 'alimentos', label: 'Alimentos' },
          { id: 'terrarios', label: 'Terrarios' },
          { id: 'calefaccion', label: 'Calefacción UV' },
          { id: 'sustratos', label: 'Sustratos' },
        ],
      },
      {
        id: 'conejos',
        label: 'Conejos',
        tipos: [
          { id: 'alimentos', label: 'Alimentos' },
          { id: 'jaulas', label: 'Jaulas y Corrales' },
          { id: 'accesorios', label: 'Accesorios' },
        ],
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function findCategoria(id: string): Categoria | undefined {
  return CATALOG.find(c => c.id === id);
}

export function findSubcategoria(categoriaId: string, subcategoriaId: string): Subcategoria | undefined {
  return findCategoria(categoriaId)?.subcategorias.find(s => s.id === subcategoriaId);
}

export function findTipo(categoriaId: string, subcategoriaId: string, tipoId: string): TipoItem | undefined {
  return findSubcategoria(categoriaId, subcategoriaId)?.tipos.find(t => t.id === tipoId);
}

/** Genera las migas de pan para una ruta jerárquica */
export function buildBreadcrumb(categoria?: string, subcategoria?: string, tipo?: string) {
  const crumbs: { label: string; href: string }[] = [{ label: 'Inicio', href: '/' }];
  if (categoria) {
    const cat = findCategoria(categoria);
    crumbs.push({ label: cat?.label ?? categoria, href: `/${categoria}` });
  }
  if (categoria && subcategoria) {
    const sub = findSubcategoria(categoria, subcategoria);
    crumbs.push({ label: sub?.label ?? subcategoria, href: `/${categoria}/${subcategoria}` });
  }
  if (categoria && subcategoria && tipo) {
    const t = findTipo(categoria, subcategoria, tipo);
    crumbs.push({ label: t?.label ?? tipo, href: `/${categoria}/${subcategoria}/${tipo}` });
  }
  return crumbs;
}

export function isValidCategoria(id: string): boolean {
  return CATALOG.some(c => c.id === id);
}

export const CATALOG_CATEGORIES = CATALOG.map(c => ({ id: c.id, label: c.label }));
