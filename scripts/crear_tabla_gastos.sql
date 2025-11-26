-- Script SQL para crear la tabla gastos en Supabase
-- Ejecuta este script en el SQL Editor de Supabase

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

-- 2. Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria);
CREATE INDEX IF NOT EXISTS idx_gastos_fecha ON gastos(fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_created_at ON gastos(created_at DESC);

-- 3. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_gastos_updated_at ON gastos;
CREATE TRIGGER update_gastos_updated_at
  BEFORE UPDATE ON gastos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Habilitar Row Level Security (RLS) - opcional
-- ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;

-- 6. Crear política para permitir todas las operaciones (ajusta según tus necesidades)
-- CREATE POLICY "Permitir todas las operaciones en gastos"
-- ON gastos
-- FOR ALL
-- USING (true)
-- WITH CHECK (true);

