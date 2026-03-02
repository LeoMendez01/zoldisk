# Zoldisk Compatibilidad (App móvil)

Aplicación móvil (Expo + React Native) para estimar compatibilidad entre dos usuarios, combinando:

- Preferencias por respuestas a cuestionario (escala de 10 opciones)
- Afinidad zodiacal calculada desde fecha de nacimiento
- Compatibilidad de intención (sexo, qué busca, tipo de vínculo)
- Proximidad cultural por nacionalidad

## Modelo inteligente (ponderado)

La app usa un **modelo híbrido y explicable** (no caja negra), con cuatro señales:

1. **Preferencias (50%)**: convierte respuestas en vectores y mide distancia normalizada pregunta a pregunta.
2. **Zodiaco (20%)**: mapea signo por fecha y aplica afinidad astrológica base.
3. **Intención (20%)**: verifica si ambas personas coinciden en tipo de vínculo y búsqueda.
4. **Nacionalidad (10%)**: suma afinidad cultural base.

Puntaje final:

`score = z*0.2 + p*0.5 + i*0.2 + n*0.1`

## Requisitos funcionales incluidos

- Pregunta sexo al iniciar.
- Pregunta si busca hombre, mujer o ambos.
- Pregunta tipo de vínculo: amistad, pareja o trabajo.
- Preguntas adaptadas al tipo de vínculo (sin mezclar amor en trabajo/amistad).
- Pregunta nacionalidad.
- Fecha de nacimiento por calendario para obtener signo zodiacal.
- Cada pregunta usa 10 opciones de respuesta para más precisión.

## Ejecutar

```bash
npm install
npm run start
```

