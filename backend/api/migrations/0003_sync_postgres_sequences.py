from django.db import migrations

def sync_sequences(apps, schema_editor):
    from api.db_utils import reset_db_sequences
    reset_db_sequences()

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_attachment_content_type_alter_attachment_id_and_more'),
    ]

    operations = [
        migrations.RunPython(sync_sequences, reverse_code=migrations.RunPython.noop),
    ]
