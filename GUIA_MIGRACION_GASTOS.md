# 📋 Guía de Migración: Gastos a Supabase

Esta guía te muestra cómo implementar la sección de Gastos con Supabase de forma 100% real.

## 📊 Paso 1: Crear la Tabla en Supabase

### 1.1. Acceder al SQL Editor de Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral, selecciona **SQL Editor**
3. Haz clic en **New Query**

### 1.2. Ejecutar el Script SQL

Copia y pega el contenido del archivo `scripts/crear_tabla_gastos.sql` en el editor y ejecútalo.

**O ejecuta este script directamente:**

```sql
-- 1. Crear la tabla gastos
CREATE TABLE IF NOT EXISTS gastos (
  id BIGSERIAL PRIMARY KEY,
  categoria VARCHAR(50) NOT NULL,
  descripcion TEXT,
  monto DECIMAL(10, 2) NOT NULL,
  fecha DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria);
CREATE INDEX IF NOT EXISTS idx_gastos_fecha ON gastos(fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_created_at ON gastos(created_at DESC);

-- 3. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger para updated_at
DROP TRIGGER IF EXISTS update_gastos_updated_at ON gastos;
CREATE TRIGGER update_gastos_updated_at
  BEFORE UPDATE ON gastos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 1.3. Verificar la Tabla

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver la tabla `gastos` con las siguientes columnas:
   - `id` (bigint, primary key)
   - `categoria` (varchar)
   - `descripcion` (text)
   - `monto` (numeric)
   - `fecha` (date)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

## 🔐 Paso 2: Configurar Políticas de Seguridad (RLS) - Opcional

Si quieres habilitar Row Level Security:

```sql
-- Habilitar RLS
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir todas las operaciones (ajusta según tus necesidades)
CREATE POLICY "Permitir todas las operaciones en gastos"
ON gastos
FOR ALL
USING (true)
WITH CHECK (true);
```

**Nota:** Por defecto, si RLS no está habilitado, las operaciones funcionarán si tienes las credenciales correctas configuradas en tu cliente Supabase.

## ✅ Paso 3: Verificar el Código

El archivo `src/Context/GastosContext.jsx` ya ha sido actualizado para usar Supabase. Verifica que:

1. ✅ Ya no hay datos mock (`GASTOS_MOCK`)
2. ✅ `fetchGastos()` hace consultas a Supabase
3. ✅ `addGasto()`, `editGasto()`, `deleteGasto()` operan con Supabase
4. ✅ El estado inicial es `loading: true` y `gastos: []`

## 🧪 Paso 4: Probar la Integración

### 4.1. Verificar Conexión

1. Abre la aplicación en tu navegador
2. Ve a la sección **Gastos**
3. Abre la consola del navegador (F12)
4. No deberías ver errores de conexión

### 4.2. Crear un Gasto de Prueba

1. Haz clic en **Nuevo Gasto**
2. Completa el formulario:
   - Categoría: `papel`
   - Descripción: `Resma de papel A4`
   - Monto: `25.50`
   - Fecha: Selecciona una fecha
3. Haz clic en **Guardar**
4. El gasto debería aparecer en la tabla

### 4.3. Verificar en Supabase

1. Ve a **Table Editor** en Supabase
2. Selecciona la tabla `gastos`
3. Deberías ver el registro que acabas de crear

## 📝 Estructura de Datos

### Campos de la Tabla `gastos`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGSERIAL | Identificador único (auto-incremental) |
| `categoria` | VARCHAR(50) | Categoría del gasto (papel, tinta, mantenimiento, etc.) |
| `descripcion` | TEXT | Descripción detallada del gasto |
| `monto` | DECIMAL(10, 2) | Monto del gasto (hasta 99,999,999.99) |
| `fecha` | DATE | Fecha del gasto (formato: YYYY-MM-DD) |
| `created_at` | TIMESTAMP | Fecha de creación (automático) |
| `updated_at` | TIMESTAMP | Fecha de última actualización (automático) |

### Categorías Válidas

Las categorías disponibles en el sistema son:
- `papel` - Compra de papel
- `tinta` - Compra de tinta o cartuchos
- `mantenimiento` - Mantenimiento de impresoras
- `reparacion` - Reparaciones
- `suministros` - Suministros varios
- `otros` - Otros gastos

## 🔧 Solución de Problemas

### Error: "relation 'gastos' does not exist"

**Solución:** La tabla no ha sido creada. Ejecuta el script SQL del Paso 1.

### Error: "permission denied for table gastos"

**Solución:** 
1. Verifica que tus credenciales de Supabase estén correctas en `src/supabaseClient.js`
2. O habilita RLS y crea las políticas adecuadas (Paso 2)

### No se muestran datos en la tabla

**Solución:**
1. Verifica que la tabla `gastos` tenga datos en Supabase
2. Revisa la consola del navegador por errores
3. Verifica que `fetchGastos()` se esté ejecutando correctamente

### Los filtros no funcionan

**Solución:** Verifica que los índices hayan sido creados correctamente:
```sql
-- Ver índices existentes
SELECT * FROM pg_indexes WHERE tablename = 'gastos';
```

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Referencia de SQL de PostgreSQL](https://www.postgresql.org/docs/)

## ✅ Checklist Final

- [ ] Tabla `gastos` creada en Supabase
- [ ] Índices creados
- [ ] Trigger de `updated_at` configurado
- [ ] `GastosContext.jsx` actualizado (ya hecho)
- [ ] Probado crear un gasto
- [ ] Probado editar un gasto
- [ ] Probado eliminar un gasto
- [ ] Probados los filtros por categoría
- [ ] Probado el filtro por fecha
- [ ] Probada la paginación

¡Listo! Tu sección de Gastos ahora está 100% conectada a Supabase. 🎉

