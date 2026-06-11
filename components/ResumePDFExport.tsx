'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

interface ResumeData {
  fullName: string;
  jobTitle: string;
  skills: string;
  summary: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    marginBottom: 12,
    color: 'gray',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  text: {
    lineHeight: 1.5,
  },
});

function ResumeDocument({ data }: { data: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{data.fullName}</Text>
        <Text style={styles.title}>{data.jobTitle}</Text>

        <View>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.text}>{data.skills}</Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.text}>{data.summary}</Text>
        </View>
      </Page>
    </Document>
  );
}

export function ResumePDFExport({ data }: { data: ResumeData }) {
  return (
    <PDFDownloadLink
      document={<ResumeDocument data={data} />}
      fileName={`${data.fullName.replace(/\s+/g, '_')}_Resume.pdf`}
    >
      {({ loading }) =>
        loading ? (
          <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm">
            Preparing PDF...
          </button>
        ) : (
          <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
            Export PDF
          </button>
        )
      }
    </PDFDownloadLink>
  );
}