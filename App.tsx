import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { calculateCompatibility } from './src/model';
import { getQuestions } from './src/questions';
import { ConnectionType, Gender, Seeking, UserProfile } from './src/types';
import { getZodiacSign, zodiacIcon } from './src/zodiac';

const genders: Gender[] = ['hombre', 'mujer', 'otro'];
const seekingOptions: Seeking[] = ['hombre', 'mujer', 'ambos'];
const connectionTypes: ConnectionType[] = ['amistad', 'pareja', 'trabajo'];

type FormState = {
  name: string;
  birthDate: Date;
  gender: Gender;
  seeking: Seeking;
  connectionType: ConnectionType;
  nationality: string;
  answers: Record<string, number>;
};

const baseForm = (): FormState => ({
  name: '',
  birthDate: new Date(1998, 0, 1),
  gender: 'hombre',
  seeking: 'ambos',
  connectionType: 'amistad',
  nationality: '',
  answers: {}
});

export default function App() {
  const [formA, setFormA] = useState<FormState>(baseForm());
  const [formB, setFormB] = useState<FormState>(baseForm());
  const [showPickerA, setShowPickerA] = useState(false);
  const [showPickerB, setShowPickerB] = useState(false);

  const questionsA = useMemo(() => getQuestions(formA.connectionType), [formA.connectionType]);
  const questionsB = useMemo(() => getQuestions(formB.connectionType), [formB.connectionType]);

  const buildProfile = (f: FormState): UserProfile => ({
    name: f.name || 'Sin nombre',
    birthDate: f.birthDate,
    zodiac: getZodiacSign(f.birthDate),
    gender: f.gender,
    seeking: f.seeking,
    connectionType: f.connectionType,
    nationality: f.nationality || 'No definida',
    answers: f.answers
  });

  const result = useMemo(() => {
    const a = buildProfile(formA);
    const b = buildProfile(formB);
    return calculateCompatibility(a, b);
  }, [formA, formB]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>✨ Zoldisk Match Zodiac ✨</Text>
        <Text style={styles.subtitle}>Compatibilidad inteligente entre personas con enfoque zodiacal</Text>

        <ProfileForm
          title="Persona A"
          form={formA}
          setForm={setFormA}
          questions={questionsA}
          showPicker={showPickerA}
          setShowPicker={setShowPickerA}
        />

        <ProfileForm
          title="Persona B"
          form={formB}
          setForm={setFormB}
          questions={questionsB}
          showPicker={showPickerB}
          setShowPicker={setShowPickerB}
        />

        <View style={styles.card}>
          <Text style={styles.resultTitle}>🔮 Resultado de compatibilidad</Text>
          <Text style={styles.score}>{result.score}%</Text>
          <Text style={styles.detail}>Zodiaco: {(result.details.zodiac * 100).toFixed(0)}%</Text>
          <Text style={styles.detail}>Preferencias: {(result.details.preferences * 100).toFixed(0)}%</Text>
          <Text style={styles.detail}>Intención y búsqueda: {(result.details.intent * 100).toFixed(0)}%</Text>
          <Text style={styles.detail}>Nacionalidad/cultura: {(result.details.nationality * 100).toFixed(0)}%</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileForm({
  title,
  form,
  setForm,
  questions,
  showPicker,
  setShowPicker
}: {
  title: string;
  form: FormState;
  setForm: (next: FormState) => void;
  questions: ReturnType<typeof getQuestions>;
  showPicker: boolean;
  setShowPicker: (v: boolean) => void;
}) {
  const zodiac = getZodiacSign(form.birthDate);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(name) => setForm({ ...form, name })}
        placeholder="Nombre"
        placeholderTextColor="#8f99b5"
      />

      <Text style={styles.label}>Sexo</Text>
      <OptionRow
        options={genders}
        selected={form.gender}
        onSelect={(gender) => setForm({ ...form, gender: gender as Gender })}
      />

      <Text style={styles.label}>¿Qué busca?</Text>
      <OptionRow
        options={seekingOptions}
        selected={form.seeking}
        onSelect={(seeking) => setForm({ ...form, seeking: seeking as Seeking })}
      />

      <Text style={styles.label}>Tipo de vínculo</Text>
      <OptionRow
        options={connectionTypes}
        selected={form.connectionType}
        onSelect={(connectionType) =>
          setForm({ ...form, connectionType: connectionType as ConnectionType, answers: {} })
        }
      />

      <Text style={styles.label}>Nacionalidad</Text>
      <TextInput
        style={styles.input}
        value={form.nationality}
        onChangeText={(nationality) => setForm({ ...form, nationality })}
        placeholder="Ej: Chilena"
        placeholderTextColor="#8f99b5"
      />

      <Text style={styles.label}>Fecha de nacimiento</Text>
      <Pressable style={styles.dateBtn} onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>{form.birthDate.toLocaleDateString()} • {zodiacIcon(zodiac)} {zodiac}</Text>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={form.birthDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selected) => {
            setShowPicker(Platform.OS === 'ios');
            if (selected) setForm({ ...form, birthDate: selected });
          }}
        />
      )}

      <Text style={styles.section}>Preguntas ({form.connectionType})</Text>
      {questions.map((q) => (
        <View key={q.id} style={styles.questionWrap}>
          <Text style={styles.qText}>{q.text}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalChoices}>
              {q.options.map((op, idx) => {
                const active = form.answers[q.id] === idx;
                return (
                  <Pressable
                    key={op}
                    style={[styles.choice, active && styles.choiceActive]}
                    onPress={() => setForm({ ...form, answers: { ...form.answers, [q.id]: idx } })}
                  >
                    <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{idx + 1}. {op}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      ))}
    </View>
  );
}

function OptionRow({
  options,
  selected,
  onSelect
}: {
  options: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.row}>
      {options.map((op) => (
        <Pressable key={op} style={[styles.chip, selected === op && styles.chipSelected]} onPress={() => onSelect(op)}>
          <Text style={[styles.chipText, selected === op && styles.chipTextSelected]}>{op}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#080c1d' },
  container: { padding: 16, paddingBottom: 80 },
  title: { color: '#f7dc8b', fontSize: 28, fontWeight: '700', textAlign: 'center', marginTop: 8 },
  subtitle: { color: '#c6cbed', textAlign: 'center', marginBottom: 16 },
  card: {
    backgroundColor: '#111933',
    borderColor: '#2f3b68',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14
  },
  cardTitle: { color: '#ffe8a8', fontSize: 18, fontWeight: '700', marginBottom: 10 },
  label: { color: '#d0d7f6', marginTop: 8, marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#32406f',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: '#f8f9ff',
    backgroundColor: '#0d1430'
  },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: '#1a2550' },
  chipSelected: { backgroundColor: '#f7dc8b' },
  chipText: { color: '#d4dbf9', textTransform: 'capitalize' },
  chipTextSelected: { color: '#2a1e00', fontWeight: '700' },
  dateBtn: { backgroundColor: '#17234a', borderRadius: 10, padding: 10 },
  dateText: { color: '#e9eeff', fontWeight: '600' },
  section: { color: '#f9e8a9', marginTop: 16, marginBottom: 8, fontSize: 16, fontWeight: '700' },
  questionWrap: { marginBottom: 12 },
  qText: { color: '#e5eaff', marginBottom: 6, fontWeight: '600' },
  horizontalChoices: { flexDirection: 'row', gap: 8 },
  choice: { paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#1b2752', borderRadius: 10 },
  choiceActive: { backgroundColor: '#8f6d17' },
  choiceText: { color: '#d7defe' },
  choiceTextActive: { color: '#fff6d6', fontWeight: '700' },
  resultTitle: { color: '#ffe7a4', fontSize: 18, fontWeight: '700' },
  score: { color: '#fff', fontSize: 42, fontWeight: '800', marginVertical: 8 },
  detail: { color: '#cfd6f8', marginBottom: 3 }
});
